package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.RegisterRequest;
import com.passwordvault.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import com.passwordvault.backend.dto.LoginRequest;
import com.passwordvault.backend.dto.ForgotPasswordRequest;
//import org.springframework.http.ResponseEntity;
import com.passwordvault.backend.dto.ResetPasswordRequest;
import com.passwordvault.backend.dto.ProfileRequest;
import org.springframework.security.core.Authentication;
import com.passwordvault.backend.entity.User;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    @Autowired
    private UserService userService;

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return userService.registerUser(request);
    }

    @PostMapping("/login")
    public String login(
            @RequestBody LoginRequest request,
            HttpServletRequest httpRequest) {

        return userService.loginUser(request, httpRequest);
    }

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {

        return userService.forgotPassword(request.getEmail());

    }

    @PostMapping("/reset-password")
    public String resetPassword(@RequestBody ResetPasswordRequest request) {

        return userService.resetPassword(
                request.getEmail(),
                request.getNewPassword(),
                request.getConfirmPassword()
        );

    }

    @GetMapping("/profile")
    public User getProfile(Authentication authentication) {

        return userService.getProfile(authentication.getName());

    }
    @PutMapping("/profile")
    public String updateProfile(
            Authentication authentication,
            @RequestBody ProfileRequest request) {

        return userService.updateProfile(authentication.getName(), request);

    }
}