package com.passwordvault.backend.dto;

public class PasswordHealthResponse {

    private long totalPasswords;
    private long strongPasswords;
    private long mediumPasswords;
    private long weakPasswords;
    private int healthScore;

    public PasswordHealthResponse() {
    }

    public PasswordHealthResponse(
            long totalPasswords,
            long strongPasswords,
            long mediumPasswords,
            long weakPasswords,
            int healthScore) {

        this.totalPasswords = totalPasswords;
        this.strongPasswords = strongPasswords;
        this.mediumPasswords = mediumPasswords;
        this.weakPasswords = weakPasswords;
        this.healthScore = healthScore;
    }

    public long getTotalPasswords() {
        return totalPasswords;
    }

    public long getStrongPasswords() {
        return strongPasswords;
    }

    public long getMediumPasswords() {
        return mediumPasswords;
    }

    public long getWeakPasswords() {
        return weakPasswords;
    }

    public int getHealthScore() {
        return healthScore;
    }
}