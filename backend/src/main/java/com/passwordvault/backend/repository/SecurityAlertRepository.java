package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.SecurityAlert;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SecurityAlertRepository
        extends JpaRepository<SecurityAlert, Long> {

    List<SecurityAlert> findAllByOrderByCreatedAtDesc();

    List<SecurityAlert> findByEmailOrderByCreatedAtDesc(String email);
}