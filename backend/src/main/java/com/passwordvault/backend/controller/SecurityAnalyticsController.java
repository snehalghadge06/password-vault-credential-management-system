package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.SecurityAnalyticsResponse;
import com.passwordvault.backend.service.SecurityAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:3000")
public class SecurityAnalyticsController {

    @Autowired
    private SecurityAnalyticsService securityAnalyticsService;

    @GetMapping("/analytics")
    public SecurityAnalyticsResponse getSecurityAnalytics() {

        return securityAnalyticsService.getSecurityAnalytics();
    }
}