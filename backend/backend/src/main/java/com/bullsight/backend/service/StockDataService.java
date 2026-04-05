package com.bullsight.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import java.math.BigDecimal;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class StockDataService {

    private final RestTemplate restTemplate = new RestTemplate();
    
    // For the Demo: This method simulates fetching real-time prices.
    // In a real SaaS, this would call the Finnhub or Alpha Vantage API.
    public Map<String, BigDecimal> getBatchPrices(List<String> symbols) {
        Map<String, BigDecimal> prices = new HashMap<>();
        
        for (String symbol : symbols) {
            // Logic: Generate a random price between 100 and 200 for the demo
            double randomPrice = 100 + (Math.random() * 100);
            prices.put(symbol, BigDecimal.valueOf(randomPrice));
        }
        
        return prices;
    }

    public BigDecimal getLivePrice(String symbol) {
        // Returns a single price for a specific stock
        double randomPrice = 150 + (Math.random() * 50);
        return BigDecimal.valueOf(randomPrice);
    }
}