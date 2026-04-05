package com.bullsight.backend.controller;

import com.bullsight.backend.model.PriceAlert;
import com.bullsight.backend.service.AlertService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/alerts")
// Updated to allow your Vite/React port specifically
@CrossOrigin(origins = "http://localhost:5199") 
public class AlertController {

    private final AlertService alertService;

    // Manual Constructor (Fixes the "not initialized" error)
    public AlertController(AlertService alertService) {
        this.alertService = alertService;
    }

    @GetMapping
    public ResponseEntity<List<PriceAlert>> getAlerts(@AuthenticationPrincipal String userId) {
        // If security is disabled, userId might be null. 
        // For the demo, we can fallback to your name.
        String effectiveUser = (userId != null) ? userId : "Durva_Pawar";
        return ResponseEntity.ok(alertService.getUserAlerts(effectiveUser));
    }

    @PostMapping
    public ResponseEntity<PriceAlert> createAlert(
        @AuthenticationPrincipal String userId,
        @RequestParam String symbol,
        @RequestParam BigDecimal targetPrice,
        @RequestParam PriceAlert.Condition condition
    ) {
        String effectiveUser = (userId != null) ? userId : "Durva_Pawar";
        return ResponseEntity.ok(alertService.createAlert(effectiveUser, symbol, targetPrice, condition));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlert(
        @AuthenticationPrincipal String userId,
        @PathVariable Long id
    ) {
        String effectiveUser = (userId != null) ? userId : "Durva_Pawar";
        alertService.deleteAlert(id, effectiveUser);
        return ResponseEntity.noContent().build();
    }
}