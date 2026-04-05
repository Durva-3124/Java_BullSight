package com.bullsight.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.bullsight.backend.model.Position;

@Repository
public interface PositionRepository extends JpaRepository<Position, Long> {
    // This allows the PortfolioService to save, update, and delete positions.
}