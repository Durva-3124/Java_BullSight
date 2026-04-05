package com.bullsight.backend.websocket;

import com.bullsight.backend.model.PriceAlert;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.*;

import java.math.BigDecimal;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class StockWebSocketHandler implements WebSocketHandler {

    // 1. Manual Logger (Fixes the "log" errors)
    private static final Logger log = LoggerFactory.getLogger(StockWebSocketHandler.class);

    private final ObjectMapper objectMapper;

    // userId -> WebSocketSession
    private final Map<String, WebSocketSession> sessions = new ConcurrentHashMap<>();

    // 2. Manual Constructor (Fixes the injection)
    public StockWebSocketHandler(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) {
        // Force the ID to match your demo name for the practical
        String userId = extractUserId(session);
        if (userId.equals(session.getId())) {
            userId = "Durva_Pawar"; 
        }
        sessions.put(userId, session);
        log.info("WS connected: stored as userId={}", userId);
    }
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        sessions.values().removeIf(s -> s.getId().equals(session.getId()));
    }

    @Override
    public void handleMessage(WebSocketSession session, WebSocketMessage<?> message) {
        log.debug("WS message from {}: {}", session.getId(), message.getPayload());
    }

    public void broadcastPriceUpdate(String symbol, BigDecimal price, BigDecimal change) {
        Map<String, Object> payload = Map.of(
            "type",   "PRICE_UPDATE",
            "symbol", symbol,
            "price",  price,
            "change", change
        );
        broadcast(payload);
    }

    public void pushAlertNotification(String userId, PriceAlert alert, BigDecimal triggeredPrice) {
        WebSocketSession session = sessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                // Using standard getters here (make sure they exist in PriceAlert model!)
                Map<String, Object> payload = Map.of(
                    "type",           "ALERT_TRIGGERED",
                    "symbol",          alert.getSymbol(),
                    "targetPrice",    alert.getTargetPrice(),
                    "triggeredPrice", triggeredPrice,
                    "condition",      alert.getCondition()
                );
                session.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
            } catch (Exception e) {
                log.error("Failed to push alert notification", e);
            }
        }
    }

    private void broadcast(Object payload) {
        sessions.values().parallelStream()
            .filter(WebSocketSession::isOpen)
            .forEach(session -> {
                try {
                    session.sendMessage(new TextMessage(objectMapper.writeValueAsString(payload)));
                } catch (Exception e) {
                    log.warn("Broadcast failed for session {}", session.getId());
                }
            });
    }

    private String extractUserId(WebSocketSession session) {
        // If security is off, this is usually null
        if (session.getPrincipal() != null) {
            return session.getPrincipal().getName();
        }
        return session.getId();
    }

    @Override public void handleTransportError(WebSocketSession s, Throwable e) {}
    @Override public boolean supportsPartialMessages() { return false; }
}