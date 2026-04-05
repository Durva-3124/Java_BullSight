package com.bullsight.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.bullsight.backend.model.Portfolio;

import java.util.Optional;

@Repository
public interface PortfolioRepository extends JpaRepository<Portfolio, Long> {

    Optional<Portfolio> findByUserId(String userId);

    @Query("SELECT p FROM Portfolio p LEFT JOIN FETCH p.positions WHERE p.userId = :userId")
    Optional<Portfolio> findByUserIdWithPositions(String userId);
}