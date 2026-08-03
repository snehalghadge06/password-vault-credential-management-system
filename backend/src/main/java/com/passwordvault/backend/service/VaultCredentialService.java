package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.VaultCredential;
import com.passwordvault.backend.repository.VaultCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.UserRepository;

import java.util.List;

@Service
public class VaultCredentialService {

    @Autowired
    private VaultCredentialRepository repository;

    public VaultCredential saveCredential(VaultCredential credential, String email) {
        System.out.println("Logged in user = " + email);
        User user = userRepository.findByEmail(email).orElseThrow();

        credential.setUser(user);

        return repository.save(credential);

    }

    @Autowired
    private UserRepository userRepository;

    public List<VaultCredential> getAllCredentials(String email) {

        User user = userRepository.findByEmail(email).orElseThrow();

        return repository.findByUserId(user.getId());

    }

    public void deleteCredential(Long id, String email) {

        User user = userRepository.findByEmail(email).orElseThrow();

        VaultCredential credential = repository.findById(id).orElseThrow();

        if (!credential.getUser().getId().equals(user.getId())) {

            throw new RuntimeException("Unauthorized");

        }

        repository.deleteById(id);

    }

    public VaultCredential updateCredential(VaultCredential credential, String email) {

        User user = userRepository.findByEmail(email).orElseThrow();

        credential.setUser(user);

        return repository.save(credential);

    }
}