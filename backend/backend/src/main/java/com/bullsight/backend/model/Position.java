package com.bullsight.backend.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "positions")

public class Position {

    public Long getId() {
		return id;
	}
	public void setId(Long id) {
		this.id = id;
	}
	public Portfolio getPortfolio() {
		return portfolio;
	}
	public void setPortfolio(Portfolio portfolio) {
		this.portfolio = portfolio;
	}
	public String getSymbol() {
		return symbol;
	}
	public void setSymbol(String symbol) {
		this.symbol = symbol;
	}
	public Integer getQuantity() {
		return quantity;
	}
	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}
	public BigDecimal getAverageBuyPrice() {
		return averageBuyPrice;
	}
	public void setAverageBuyPrice(BigDecimal averageBuyPrice) {
		this.averageBuyPrice = averageBuyPrice;
	}
	public Instant getOpenedAt() {
		return openedAt;
	}
	public void setOpenedAt(Instant openedAt) {
		this.openedAt = openedAt;
	}
	public Instant getUpdatedAt() {
		return updatedAt;
	}
	public void setUpdatedAt(Instant updatedAt) {
		this.updatedAt = updatedAt;
	}
	@Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "portfolio_id", nullable = false)
    private Portfolio portfolio;

    @Column(nullable = false, length = 10)
    private String symbol;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 19, scale = 4)
    private BigDecimal averageBuyPrice;

    private Instant openedAt;
    private Instant updatedAt;

    @PrePersist  public void onCreate() { openedAt = updatedAt = Instant.now(); }
    @PreUpdate   public void onUpdate() { updatedAt = Instant.now(); }
}