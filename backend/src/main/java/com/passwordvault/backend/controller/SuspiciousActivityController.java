package com.passwordvault.backend.controller;

import com.passwordvault.backend.entity.SuspiciousActivity;
import com.passwordvault.backend.repository.SuspiciousActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:3000")
public class SuspiciousActivityController {

    @Autowired
    private SuspiciousActivityRepository suspiciousActivityRepository;

    @GetMapping("/suspicious-activity")
    public List<SuspiciousActivity> getSuspiciousActivities() {

        return suspiciousActivityRepository
                .findAllByOrderByDetectedAtDesc();
    }
}