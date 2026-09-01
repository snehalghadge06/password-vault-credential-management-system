package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.LoginActivity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LoginActivityRepository
        extends JpaRepository<LoginActivity, Long> {

    List<LoginActivity> findByEmailOrderByLoginTimeDesc(String email);

    long countByStatus(String status);
}