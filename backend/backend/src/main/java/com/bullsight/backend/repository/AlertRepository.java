package com.bullsight.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bullsight.backend.model.PriceAlert;

import java.util.List;

@Repository
public interface AlertRepository extends JpaRepository<PriceAlert, Long> {

    List<PriceAlert> findByUserIdAndTriggeredFalse(String userId);

    @Query("SELECT a FROM PriceAlert a WHERE a.triggered = false AND a.symbol = :symbol")
    List<PriceAlert> findActiveBySymbol(String symbol);

    List<PriceAlert> findByUserId(String userId);
}