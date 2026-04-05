package com.bullsight.backend.controller;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;
import java.math.BigDecimal;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "http://localhost:5199") // This fixes the CORS error!
public class OrderController {

    // For now, we will create a simple mock response to test the "Buy" button
    @PostMapping
    public ResponseEntity<String> placeOrder(
        @RequestParam String userId,
        @RequestParam String symbol,
        @RequestParam int quantity,
        @RequestParam String orderType,
        @RequestParam BigDecimal price
    ) {
        System.out.println("Order Received for " + userId + ": " + orderType + " " + quantity + " shares of " + symbol);
        
        // In a real app, you'd call an OrderService here to save to the DB
        return ResponseEntity.ok("Order placed successfully for " + symbol);
    }
}