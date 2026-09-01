package com.passwordvault.backend.service;

import com.passwordvault.backend.dto.SecurityAnalyticsResponse;
import com.passwordvault.backend.repository.LoginActivityRepository;
import com.passwordvault.backend.repository.SuspiciousActivityRepository;
import com.passwordvault.backend.repository.SecurityAlertRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SecurityAnalyticsService {

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    @Autowired
    private SuspiciousActivityRepository suspiciousActivityRepository;

    @Autowired
    private SecurityAlertRepository securityAlertRepository;

    public SecurityAnalyticsResponse getSecurityAnalytics() {

        long totalLoginAttempts =
                loginActivityRepository.count();

        long successfulLogins =
                loginActivityRepository.countByStatus("SUCCESS");

        long failedLogins =
                loginActivityRepository.countByStatus("FAILED");

        long suspiciousActivities =
                suspiciousActivityRepository.count();

        long securityAlerts =
                securityAlertRepository.count();

        return new SecurityAnalyticsResponse(
                totalLoginAttempts,
                successfulLogins,
                failedLogins,
                suspiciousActivities,
                securityAlerts
        );
    }
}