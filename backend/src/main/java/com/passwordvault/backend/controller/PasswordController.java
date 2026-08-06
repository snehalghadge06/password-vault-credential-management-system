package com.passwordvault.backend.controller;

import com.passwordvault.backend.util.PasswordGeneratorUtil;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/password")
@CrossOrigin(origins = "http://localhost:3000")
public class PasswordController {

    @GetMapping("/generate")
    public String generatePassword(
            @RequestParam(defaultValue = "12") int length) {

        System.out.println("Password Generate API Called");

        return PasswordGeneratorUtil.generatePassword(length);
    }

}