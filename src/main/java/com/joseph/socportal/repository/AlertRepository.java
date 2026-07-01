package com.joseph.socportal.repository;

import com.joseph.socportal.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlertRepository extends JpaRepository<Alert, Long> {
}