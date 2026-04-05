package com.bullsight.backend.websocket;

import okhttp3.*;
import org.springframework.stereotype.Service;
import jakarta.annotation.PostConstruct;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class FinnhubService {

    private final StockWebSocketHandler handler;
    private final ObjectMapper mapper = new ObjectMapper();
    private final String API_KEY =" d77or4pr01qp6afmcss0d77or4pr01qp6afmcssg"; // Get this from Finnhub.io

    public FinnhubService(StockWebSocketHandler handler) {
        this.handler = handler;
    }

    @PostConstruct
    public void connect() {
        OkHttpClient client = new OkHttpClient();
        Request request = new Request.Builder()
            .url("wss://ws.finnhub.io?token=" + API_KEY)
            .build();

        client.newWebSocket(request, new WebSocketListener() {
        	@Override
        	public void onOpen(WebSocket webSocket, Response response) {
        	    // This will send data every second, regardless of the time!
        	    webSocket.send("{\"type\":\"subscribe\",\"symbol\":\"BINANCE:BTCUSDT\"}");
        	}
            @Override
            public void onMessage(WebSocket webSocket, String text) {
                try {
                    JsonNode node = mapper.readTree(text);
                    if (node.has("data")) {
                        JsonNode trade = node.get("data").get(0);
                        String symbol = trade.get("s").asText();
                        double price = trade.get("p").asDouble();
                        
                        // Push this real data to your React Frontend!
                        handler.broadcastPriceUpdate(symbol, java.math.BigDecimal.valueOf(price), java.math.BigDecimal.ZERO);
                    }
                } catch (Exception e) {
                    e.printStackTrace();
                }
            }
        });
    }
}