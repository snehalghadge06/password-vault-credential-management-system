package com.passwordvault.backend.controller;

import com.passwordvault.backend.entity.SecurityAlert;
import com.passwordvault.backend.repository.SecurityAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:3000")
public class SecurityAlertController {

    @Autowired
    private SecurityAlertRepository securityAlertRepository;

    @GetMapping("/alerts")
    public List<SecurityAlert> getSecurityAlerts() {

        return securityAlertRepository
                .findAllByOrderByCreatedAtDesc();
    }
}