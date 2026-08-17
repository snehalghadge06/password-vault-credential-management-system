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

    @Autowired
    private SharedCredentialRepository sharedRepository;

    @Autowired
    private UserRepository userRepository;


    // ===============================
    // SAVE CREDENTIAL
    // ===============================

    public VaultCredential saveCredential(
            VaultCredential credential,
            String email) {

        System.out.println("Logged in user = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        credential.setUser(user);

        credential.setPassword(
                AESUtil.encrypt(credential.getPassword())
        );

        return repository.save(credential);
    }


    // ===============================
    // SHARE CREDENTIAL
    // ===============================

    public void shareCredential(
            ShareCredentialRequest request,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        VaultCredential credential = repository
                .findById(request.getCredentialId())
                .orElseThrow(() ->
                        new RuntimeException("Credential not found"));


        // Owner can always share
        boolean isOwner =
                credential.getUser().getId().equals(user.getId());


        // If user is not owner,
        // check FULL_MANAGEMENT permission
        if (!isOwner) {

            SharedCredential existingShare =
                    sharedRepository
                            .findByCredentialIdAndSharedWith(
                                    credential.getId(),
                                    user
                            )
                            .orElseThrow(() ->
                                    new RuntimeException("Unauthorized"));


            if (!"FULL_MANAGEMENT".equalsIgnoreCase(
                    existingShare.getPermission())) {

                throw new RuntimeException(
                        "You do not have permission to share this credential."
                );
            }
        }


        // Find recipient
        User sharedUser = userRepository
                .findByEmail(request.getEmail())
                .orElseThrow(() ->
                        new RuntimeException("Recipient user not found"));


        // Create sharing record
        SharedCredential sharedCredential =
                new SharedCredential();

        sharedCredential.setOwner(credential.getUser());
        sharedCredential.setSharedWith(sharedUser);
        sharedCredential.setCredential(credential);
        sharedCredential.setPermission(request.getPermission());

        sharedRepository.save(sharedCredential);
    }


    // ===============================
    // GET MY CREDENTIALS
    // ===============================

    public List<VaultCredential> getAllCredentials(
            String email) {

        System.out.println("Inside getAllCredentials()");
        System.out.println("Email = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        System.out.println("User ID = " + user.getId());

        List<VaultCredential> credentials =
                repository.findByUserId(user.getId());

        System.out.println(
                "Records = " + credentials.size()
        );

        return credentials;
    }


    // ===============================
    // DELETE CREDENTIAL
    // ===============================

    public void deleteCredential(
            Long id,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        VaultCredential credential =
                repository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"));


        // Owner can always delete
        if (credential.getUser().getId()
                .equals(user.getId())) {

            repository.deleteById(id);
            return;
        }


        // Check shared permission
        SharedCredential sharedCredential =
                sharedRepository
                        .findByCredentialIdAndSharedWith(
                                id,
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Unauthorized"));


        // Only FULL_MANAGEMENT can delete
        if (!"FULL_MANAGEMENT".equalsIgnoreCase(
                sharedCredential.getPermission())) {

            throw new RuntimeException(
                    "You do not have permission to delete this credential."
            );
        }


        repository.deleteById(id);
    }


    // ===============================
    // UPDATE CREDENTIAL
    // ===============================

    public VaultCredential updateCredential(
            VaultCredential credential,
            String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        VaultCredential existingCredential =
                repository.findById(credential.getId())
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Credential not found"));


        // Owner can always update
        if (existingCredential.getUser().getId()
                .equals(user.getId())) {

            credential.setUser(
                    existingCredential.getUser()
            );

            return repository.save(credential);
        }


        // Check shared permission
        SharedCredential sharedCredential =
                sharedRepository
                        .findByCredentialIdAndSharedWith(
                                existingCredential.getId(),
                                user
                        )
                        .orElseThrow(() ->
                                new RuntimeException(
                                        "Access Denied"));


        String permission =
                sharedCredential.getPermission();


        // READ permission
        if ("READ".equalsIgnoreCase(permission)) {

            throw new RuntimeException(
                    "You have READ permission only."
            );
        }


        // WRITE or FULL_MANAGEMENT
        if ("WRITE".equalsIgnoreCase(permission)
                || "FULL_MANAGEMENT".equalsIgnoreCase(
                permission)) {

            credential.setUser(
                    existingCredential.getUser()
            );

            return repository.save(credential);
        }


        throw new RuntimeException(
                "Invalid permission."
        );
    }


    // ===============================
    // GET SHARED CREDENTIALS
    // ===============================

    /* public List<SharedCredential> getSharedCredentials(
             String email) {

         User user = userRepository.findByEmail(email)
                 .orElseThrow(() ->
                         new RuntimeException(
                                 "User not found"));

         return sharedRepository.findBySharedWith(user);
     }
 }*/
    public List<SharedCredential> getSharedCredentials(String email) {

        System.out.println("===== SHARED CREDENTIALS =====");
        System.out.println("Logged in Email = " + email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        System.out.println("Logged in User ID = " + user.getId());

        List<SharedCredential> shared =
                sharedRepository.findBySharedWith(user);

        System.out.println("Shared Credentials Count = " + shared.size());

        for (SharedCredential sc : shared) {
            System.out.println(
                    "Credential ID = " + sc.getCredential().getId()
                            + " | Owner = " + sc.getOwner().getEmail()
                            + " | Shared With = " + sc.getSharedWith().getEmail()
                            + " | Permission = " + sc.getPermission()
            );
        }

        return shared;
    }
}