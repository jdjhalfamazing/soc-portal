package com.joseph.socportal.repository;

import com.joseph.socportal.model.Alert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AlertRepository extends JpaRepository<Alert, Long> {

    List<Alert> findByHost(String host);

}