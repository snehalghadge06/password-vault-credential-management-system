package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.SuspiciousActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SuspiciousActivityRepository
        extends JpaRepository<SuspiciousActivity, Long> {

    List<SuspiciousActivity> findByEmailOrderByDetectedAtDesc(String email);

    List<SuspiciousActivity> findAllByOrderByDetectedAtDesc();

}