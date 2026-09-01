package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.AuditLog;
import com.passwordvault.backend.entity.LoginActivity;
import com.passwordvault.backend.entity.SecurityAlert;
import com.passwordvault.backend.entity.SuspiciousActivity;
import com.passwordvault.backend.repository.AuditLogRepository;
import com.passwordvault.backend.repository.LoginActivityRepository;
import com.passwordvault.backend.repository.SecurityAlertRepository;
import com.passwordvault.backend.repository.SuspiciousActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SecurityMonitoringService {

    private static final int FAILED_LOGIN_THRESHOLD = 5;

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    @Autowired
    private SuspiciousActivityRepository suspiciousActivityRepository;

    @Autowired
    private SecurityAlertRepository securityAlertRepository;

    @Autowired
    private AuditLogRepository auditLogRepository;


    public void analyzeLoginActivity(LoginActivity activity) {

        // Only failed login attempts should be analyzed
        if (!"FAILED".equalsIgnoreCase(activity.getStatus())) {
            return;
        }

        String email = activity.getEmail();

        // Get all login activities for this email
        List<LoginActivity> activities =
                loginActivityRepository.findByEmailOrderByLoginTimeDesc(email);

        // Count failed login attempts
        long failedAttempts = activities.stream()
                .filter(login ->
                        "FAILED".equalsIgnoreCase(login.getStatus()))
                .count();

        // Check threshold
        if (failedAttempts >= FAILED_LOGIN_THRESHOLD) {

            // Prevent duplicate suspicious activity for the same condition
            List<SuspiciousActivity> existingActivities =
                    suspiciousActivityRepository
                            .findByEmailOrderByDetectedAtDesc(email);

            boolean alreadyDetected = existingActivities.stream()
                    .anyMatch(existing ->
                            "MULTIPLE_FAILED_LOGINS"
                                    .equals(existing.getActivityType())
                                    && "OPEN".equals(existing.getStatus()));

            if (alreadyDetected) {
                return;
            }

            createSuspiciousActivity(
                    activity,
                    (int) failedAttempts
            );

            createSecurityAlert(
                    activity,
                    (int) failedAttempts
            );

            createAuditLog(
                    activity,
                    (int) failedAttempts
            );
        }
    }


    private void createSuspiciousActivity(
            LoginActivity activity,
            int failedAttempts) {

        SuspiciousActivity suspiciousActivity =
                new SuspiciousActivity();

        suspiciousActivity.setEmail(activity.getEmail());

        suspiciousActivity.setActivityType(
                "MULTIPLE_FAILED_LOGINS"
        );

        suspiciousActivity.setDescription(
                "Multiple failed login attempts detected for the user."
        );

        suspiciousActivity.setFailedAttempts(
                failedAttempts
        );

        suspiciousActivity.setIpAddress(
                activity.getIpAddress()
        );

        suspiciousActivity.setDetectedAt(
                LocalDateTime.now()
        );

        suspiciousActivity.setStatus("OPEN");

        suspiciousActivityRepository.save(
                suspiciousActivity
        );
    }


    private void createSecurityAlert(
            LoginActivity activity,
            int failedAttempts) {

        SecurityAlert alert = new SecurityAlert();

        alert.setEmail(activity.getEmail());

        alert.setAlertType(
                "SUSPICIOUS_LOGIN_ACTIVITY"
        );

        alert.setMessage(
                "Suspicious activity detected: "
                        + failedAttempts
                        + " failed login attempts."
        );

        alert.setSeverity("HIGH");

        alert.setCreatedAt(
                LocalDateTime.now()
        );

        alert.setStatus("OPEN");

        securityAlertRepository.save(alert);
    }


    private void createAuditLog(
            LoginActivity activity,
            int failedAttempts) {

        AuditLog auditLog = new AuditLog();

        auditLog.setEmail(activity.getEmail());

        auditLog.setAction(
                "SUSPICIOUS_ACTIVITY_DETECTED"
        );

        auditLog.setDescription(
                "System detected "
                        + failedAttempts
                        + " failed login attempts."
        );

        auditLog.setTimestamp(
                LocalDateTime.now()
        );

        auditLog.setIpAddress(
                activity.getIpAddress()
        );

        auditLogRepository.save(auditLog);
    }
}