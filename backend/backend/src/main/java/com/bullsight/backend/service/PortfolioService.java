package com.bullsight.backend.service;

import com.bullsight.backend.model.*;
import com.bullsight.backend.repository.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;

@Service
public class PortfolioService {

    // 1. Manual Logger
    private static final Logger log = LoggerFactory.getLogger(PortfolioService.class);

    private final PortfolioRepository portfolioRepo;
    private final PositionRepository  positionRepo;

    // 2. Manual Constructor
    public PortfolioService(PortfolioRepository portfolioRepo, PositionRepository positionRepo) {
        this.portfolioRepo = portfolioRepo;
        this.positionRepo = positionRepo;
    }

    @Transactional
    public Portfolio getPortfolio(String userId) {
        return portfolioRepo.findByUserIdWithPositions(userId)
            .orElseGet(() -> createEmptyPortfolio(userId));
    }

    @Transactional
    public Position addPosition(String userId, String symbol, int qty, BigDecimal price) {
        Portfolio portfolio = portfolioRepo.findByUserId(userId)
            .orElseGet(() -> createEmptyPortfolio(userId));

        // Check for existing position — average down/up
        return portfolio.getPositions().stream()
            .filter(p -> p.getSymbol().equals(symbol))
            .findFirst()
            .map(existing -> {
                BigDecimal totalCost = existing.getAverageBuyPrice()
                    .multiply(BigDecimal.valueOf(existing.getQuantity()))
                    .add(price.multiply(BigDecimal.valueOf(qty)));
                int newQty = existing.getQuantity() + qty;
                existing.setQuantity(newQty);
                existing.setAverageBuyPrice(totalCost.divide(
                    BigDecimal.valueOf(newQty), 4, RoundingMode.HALF_UP));
                return positionRepo.save(existing);
            })
            .orElseGet(() -> {
                // 3. Manual Position creation (Replaces Position.builder())
                Position pos = new Position();
                pos.setPortfolio(portfolio);
                pos.setSymbol(symbol);
                pos.setQuantity(qty);
                pos.setAverageBuyPrice(price);
                
                portfolio.getPositions().add(pos);
                return positionRepo.save(pos);
            });
    }

    @Transactional
    public void removePosition(String userId, Long positionId) {
        Portfolio portfolio = portfolioRepo.findByUserId(userId)
            .orElseThrow(() -> new RuntimeException("Portfolio not found"));
        portfolio.getPositions().removeIf(p -> p.getId().equals(positionId));
        portfolioRepo.save(portfolio);
    }

    private Portfolio createEmptyPortfolio(String userId) {
        // 4. Manual Portfolio creation (Replaces Portfolio.builder())
        Portfolio portfolio = new Portfolio();
        portfolio.setUserId(userId);
        portfolio.setPositions(new ArrayList<>());
        return portfolioRepo.save(portfolio);
    }
}