package com.passwordvault.backend.service;

import com.passwordvault.backend.dto.RegisterRequest;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.passwordvault.backend.dto.LoginRequest;
import java.util.Optional;
import com.passwordvault.backend.security.JwtUtil;
import com.passwordvault.backend.dto.ProfileRequest;
import com.passwordvault.backend.entity.LoginActivity;
import com.passwordvault.backend.repository.LoginActivityRepository;
import java.time.LocalDateTime;
import jakarta.servlet.http.HttpServletRequest;

@Service
public class UserService {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    @Autowired
    private SecurityMonitoringService securityMonitoringService;

    public String registerUser(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            return "Email already exists";
        }

        User user = new User();
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "User Registered Successfully";
    }

    public String loginUser(
            LoginRequest request,
            HttpServletRequest httpRequest) {

        Optional<User> userOptional =
                userRepository.findByEmail(request.getEmail());

        // Case 1: Email not found
        if (userOptional.isEmpty()) {

            LoginActivity activity = new LoginActivity();

            activity.setEmail(request.getEmail());
            activity.setLoginTime(LocalDateTime.now());
            activity.setStatus("FAILED");
            activity.setFailureReason("Invalid Email");
            activity.setIpAddress(httpRequest.getRemoteAddr());
            activity.setUserAgent(httpRequest.getHeader("User-Agent"));

            loginActivityRepository.save(activity);

            securityMonitoringService.analyzeLoginActivity(activity);

            return "Invalid Email";
        }

        User user = userOptional.get();

        // Case 2: Wrong password
        if (!passwordEncoder.matches(
                request.getPassword(),
                user.getPassword())) {

            LoginActivity activity = new LoginActivity();

            activity.setEmail(request.getEmail());
            activity.setLoginTime(LocalDateTime.now());
            activity.setStatus("FAILED");
            activity.setFailureReason("Invalid Password");
            activity.setIpAddress(httpRequest.getRemoteAddr());
            activity.setUserAgent(httpRequest.getHeader("User-Agent"));

            loginActivityRepository.save(activity);

            securityMonitoringService.analyzeLoginActivity(activity);

            return "Invalid Password";
        }

        // Case 3: Successful login
        LoginActivity activity = new LoginActivity();
        activity.setEmail(request.getEmail());
        activity.setLoginTime(LocalDateTime.now());
        activity.setStatus("SUCCESS");
        activity.setIpAddress(httpRequest.getRemoteAddr());
        activity.setUserAgent(httpRequest.getHeader("User-Agent"));

        loginActivityRepository.save(activity);

        return jwtUtil.generateToken(user.getEmail());
    }

    public String forgotPassword(String email) {

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return "Email not found";
        }

        return "Email verified";

    }

    public String resetPassword(String email, String newPassword, String confirmPassword) {

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return "Email not found";
        }

        if (!newPassword.equals(confirmPassword)) {
            return "Passwords do not match";
        }

        User user = userOptional.get();

        user.setPassword(passwordEncoder.encode(newPassword));

        userRepository.save(user);

        return "Password Reset Successfully";
    }

    public User getProfile(String email) {

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return null;
        }

        return userOptional.get();

    }

    public String updateProfile(String email, ProfileRequest request) {

        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isEmpty()) {
            return "User not found";
        }

        User user = userOptional.get();

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());

        userRepository.save(user);

        return "Profile Updated Successfully";
    }
}