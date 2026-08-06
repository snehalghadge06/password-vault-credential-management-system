package com.passwordvault.backend.service;

import com.passwordvault.backend.entity.VaultCredential;
import com.passwordvault.backend.repository.VaultCredentialRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.repository.UserRepository;
import com.passwordvault.backend.util.AESUtil;
import com.passwordvault.backend.repository.SharedCredentialRepository;
import com.passwordvault.backend.dto.ShareCredentialRequest;
import com.passwordvault.backend.entity.SharedCredential;

import java.util.List;

@Service
public class VaultCredentialService {

    @Autowired
    private VaultCredentialRepository repository;

    public VaultCredential saveCredential(VaultCredential credential, String email) {
        System.out.println("Logged in user = " + email);
        User user = userRepository.findByEmail(email).orElseThrow();

        credential.setUser(user);

        credential.setPassword(
                AESUtil.encrypt(credential.getPassword())
        );

        return repository.save(credential);

    }

    @Autowired
    private SharedCredentialRepository sharedRepository;

    @Autowired
    private UserRepository userRepository;

    public void shareCredential(ShareCredentialRequest request) {

        VaultCredential credential = repository
                .findById(request.getCredentialId())
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        User sharedUser = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        SharedCredential sharedCredential = new SharedCredential();

        sharedCredential.setOwner(credential.getUser());
        sharedCredential.setSharedWith(sharedUser);
        sharedCredential.setCredential(credential);
        sharedCredential.setPermission(request.getPermission());

        sharedRepository.save(sharedCredential);
    }

    public List<VaultCredential> getAllCredentials(String email) {

        System.out.println("Inside getAllCredentials()");
        System.out.println("Email = " + email);

        User user = userRepository.findByEmail(email).orElseThrow();

        System.out.println("User ID = " + user.getId());

        List<VaultCredential> credentials = repository.findByUserId(user.getId());

        System.out.println("Records = " + credentials.size());

        return credentials;
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

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VaultCredential existingCredential = repository.findById(credential.getId())
                .orElseThrow(() -> new RuntimeException("Credential not found"));

        // Owner can always update
        if (existingCredential.getUser().getId().equals(user.getId())) {
            credential.setUser(existingCredential.getUser());
            return repository.save(credential);
        }

        // Check shared permission
        SharedCredential sharedCredential = sharedRepository
                .findByCredentialIdAndSharedWith(existingCredential.getId(), user)
                .orElseThrow(() -> new RuntimeException("Access Denied"));

        if ("READ".equalsIgnoreCase(sharedCredential.getPermission())) {
            throw new RuntimeException("You have READ permission only.");
        }

        // WRITE permission
        credential.setUser(existingCredential.getUser());

        return repository.save(credential);
    }

    public List<SharedCredential> getSharedCredentials(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return sharedRepository.findBySharedWith(user);
    }
}