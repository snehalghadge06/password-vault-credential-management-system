package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.PasswordHealthResponse;
import com.passwordvault.backend.service.PasswordHealthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordHealthController {

    @Autowired
    private PasswordHealthService passwordHealthService;

    @GetMapping("/reports/password-health")
    public PasswordHealthResponse getPasswordHealth(
            Authentication authentication) {

        return passwordHealthService.getPasswordHealth(
                authentication.getName()
        );
    }
}