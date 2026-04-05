package com.bullsight.backend.service;

import com.bullsight.backend.model.PriceAlert;
import com.bullsight.backend.repository.AlertRepository;
import com.bullsight.backend.websocket.StockWebSocketHandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.time.Instant;
import java.util.List;
import java.util.Map;

@Service
public class AlertService {

    // 1. Manual Logger (Replaces @Slf4j)
    private static final Logger log = LoggerFactory.getLogger(AlertService.class);

    private final AlertRepository alertRepo;
    private final StockWebSocketHandler wsHandler;
    private final StockDataService stockDataService;

    // 2. Manual Constructor (Replaces @RequiredArgsConstructor)
    public AlertService(AlertRepository alertRepo, StockWebSocketHandler wsHandler, StockDataService stockDataService) {
        this.alertRepo = alertRepo;
        this.wsHandler = wsHandler;
        this.stockDataService = stockDataService;
    }

    public PriceAlert createAlert(String userId, String symbol, BigDecimal targetPrice, PriceAlert.Condition condition) {
        // 3. Manual Object Creation (Replaces .builder())
        PriceAlert alert = new PriceAlert();
        alert.setUserId(userId);
        alert.setSymbol(symbol);
        alert.setTargetPrice(targetPrice);
        alert.setCondition(condition);
        alert.setTriggered(false);
        
        return alertRepo.save(alert);
    }

    public List<PriceAlert> getUserAlerts(String userId) {
        return alertRepo.findByUserId(userId);
    }

    @Transactional
    public void deleteAlert(Long alertId, String userId) {
        PriceAlert alert = alertRepo.findById(alertId)
            .filter(a -> a.getUserId().equals(userId))
            .orElseThrow(() -> new RuntimeException("Alert not found"));
        alertRepo.delete(alert);
    }

    @Scheduled(fixedDelay = 5000)
    @Transactional
    public void evaluateAlerts() {
        List<PriceAlert> active = alertRepo.findByUserIdAndTriggeredFalse("*");
        if (active.isEmpty()) return;

        Map<String, BigDecimal> prices = stockDataService.getBatchPrices(
            active.stream().map(a -> a.getSymbol()).toList()
        );

        active.forEach(alert -> {
            BigDecimal current = prices.get(alert.getSymbol());
            if (current == null) return;
            
            boolean triggered =
                (alert.getCondition() == PriceAlert.Condition.ABOVE && current.compareTo(alert.getTargetPrice()) >= 0) ||
                (alert.getCondition() == PriceAlert.Condition.BELOW && current.compareTo(alert.getTargetPrice()) <= 0);

            if (triggered) {
                alert.setTriggered(true);
                alert.setTriggeredAt(Instant.now());
                alertRepo.save(alert);
                wsHandler.pushAlertNotification(alert.getUserId(), alert, current);
                log.info("Alert triggered: {} {} ${}", alert.getSymbol(), alert.getCondition(), current);
            }
        });
    }
}