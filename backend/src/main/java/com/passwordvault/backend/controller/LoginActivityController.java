package com.passwordvault.backend.controller;

import com.passwordvault.backend.entity.LoginActivity;
import com.passwordvault.backend.service.LoginActivityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/security")
@CrossOrigin(origins = "http://localhost:3000")
public class LoginActivityController {

    @Autowired
    private LoginActivityService loginActivityService;

    @GetMapping("/login-activity")
    public List<LoginActivity> getLoginActivities() {
        return loginActivityService.getAllLoginActivities();
    }
}