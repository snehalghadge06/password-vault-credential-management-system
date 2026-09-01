package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.LoginActivity;
import com.passwordvault.backend.repository.LoginActivityRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LoginActivityService {

    @Autowired
    private LoginActivityRepository loginActivityRepository;

    public List<LoginActivity> getAllLoginActivities() {
        return loginActivityRepository.findAll();
    }
}