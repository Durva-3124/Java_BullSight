package com.bullsight.backend.controller;

import com.bullsight.backend.model.Portfolio;
import com.bullsight.backend.model.Position;
import com.bullsight.backend.service.PortfolioService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/portfolio")
// Hardcoded for Vite/React port 5173
@CrossOrigin(origins = "http://localhost:5199")
public class PortfolioController {

    private final PortfolioService portfolioService;

    // Manual Constructor (Fixes "not initialized" error)
    public PortfolioController(PortfolioService portfolioService) {
        this.portfolioService = portfolioService;
    }

    @GetMapping
    public ResponseEntity<Portfolio> getPortfolio(@AuthenticationPrincipal String userId) {
        // Fallback for demo if not logged in
        String effectiveUser = (userId != null) ? userId : "Durva_Pawar";
        return ResponseEntity.ok(portfolioService.getPortfolio(effectiveUser));
    }

    @PostMapping("/positions")
    public ResponseEntity<Position> addPosition(
        @AuthenticationPrincipal String userId,
        @RequestParam String  symbol,
        @RequestParam int     quantity,
        @RequestParam BigDecimal price
    ) {
        String effectiveUser = (userId != null) ? userId : "Durva_Pawar";
        return ResponseEntity.ok(portfolioService.addPosition(effectiveUser, symbol, quantity, price));
    }

    @DeleteMapping("/positions/{id}")
    public ResponseEntity<Void> removePosition(
        @AuthenticationPrincipal String userId,
        @PathVariable Long id
    ) {
        String effectiveUser = (userId != null) ? userId : "Durva_Pawar";
        portfolioService.removePosition(effectiveUser, id);
        return ResponseEntity.noContent().build();
    }
}