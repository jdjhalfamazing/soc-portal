package com.joseph.socportal.repository;

import com.joseph.socportal.model.IndicatorOfCompromise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface IndicatorOfCompromiseRepository
        extends JpaRepository<IndicatorOfCompromise, Long> {
}