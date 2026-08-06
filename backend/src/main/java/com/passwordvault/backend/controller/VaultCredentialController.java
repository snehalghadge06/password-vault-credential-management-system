package com.passwordvault.backend.controller;

import com.passwordvault.backend.dto.ShareCredentialRequest;
import com.passwordvault.backend.entity.VaultCredential;
import com.passwordvault.backend.service.VaultCredentialService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import com.passwordvault.backend.entity.SharedCredential;
import java.util.List;

@RestController
@RequestMapping("/api/vault")
@CrossOrigin(origins = "http://localhost:3000")
public class VaultCredentialController {

    @Autowired
    private VaultCredentialService service;

    @PostMapping
    public VaultCredential addCredential(
            @RequestBody VaultCredential credential,
            Authentication authentication) {

        return service.saveCredential(
                credential,
                authentication.getName()
        );

    }

    @GetMapping
    public List<VaultCredential> getAllCredentials(
            Authentication authentication) {

        return service.getAllCredentials(
                authentication.getName()
        );

    }

    @PutMapping
    public VaultCredential updateCredential(
            @RequestBody VaultCredential credential,
            Authentication authentication) {

        return service.updateCredential(
                credential,
                authentication.getName()
        );

    }

    @DeleteMapping("/{id}")
    public void deleteCredential(
            @PathVariable Long id,
            Authentication authentication) {

        service.deleteCredential(
                id,
                authentication.getName()
        );

    }

    @PostMapping("/share")
    public ResponseEntity<String> shareCredential(
            @RequestBody ShareCredentialRequest request) {

        service.shareCredential(request);

        return ResponseEntity.ok("Credential Shared Successfully");
    }

    @GetMapping("/shared")
    public List<SharedCredential> getSharedCredentials(
            Authentication authentication) {

        return service.getSharedCredentials(authentication.getName());
    }
}