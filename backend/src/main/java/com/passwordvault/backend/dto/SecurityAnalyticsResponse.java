package com.passwordvault.backend.dto;

public class SecurityAnalyticsResponse {

    private long totalLoginAttempts;
    private long successfulLogins;
    private long failedLogins;
    private long suspiciousActivities;
    private long securityAlerts;

    public SecurityAnalyticsResponse() {
    }

    public SecurityAnalyticsResponse(
            long totalLoginAttempts,
            long successfulLogins,
            long failedLogins,
            long suspiciousActivities,
            long securityAlerts) {

        this.totalLoginAttempts = totalLoginAttempts;
        this.successfulLogins = successfulLogins;
        this.failedLogins = failedLogins;
        this.suspiciousActivities = suspiciousActivities;
        this.securityAlerts = securityAlerts;
    }

    public long getTotalLoginAttempts() {
        return totalLoginAttempts;
    }

    public long getSuccessfulLogins() {
        return successfulLogins;
    }

    public long getFailedLogins() {
        return failedLogins;
    }

    public long getSuspiciousActivities() {
        return suspiciousActivities;
    }

    public long getSecurityAlerts() {
        return securityAlerts;
    }
}