package com.passwordvault.backend.service;

import com.passwordvault.backend.dto.PasswordHealthResponse;
import com.passwordvault.backend.entity.User;
import com.passwordvault.backend.entity.VaultCredential;
import com.passwordvault.backend.repository.UserRepository;
import com.passwordvault.backend.repository.VaultCredentialRepository;
import com.passwordvault.backend.util.AESUtil;
import com.passwordvault.backend.util.PasswordStrengthUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PasswordHealthService {

    @Autowired
    private VaultCredentialRepository vaultCredentialRepository;

    @Autowired
    private UserRepository userRepository;

    public PasswordHealthResponse getPasswordHealth(String email) {

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<VaultCredential> credentials =
                vaultCredentialRepository.findByUserId(user.getId());

        long strong = 0;
        long medium = 0;
        long weak = 0;

        for (VaultCredential credential : credentials) {

            try {

                String encryptedPassword =
                        credential.getPassword();

                String decryptedPassword =
                        AESUtil.decrypt(encryptedPassword);

                String strength =
                        PasswordStrengthUtil.checkStrength(
                                decryptedPassword
                        );

                if ("Strong".equalsIgnoreCase(strength)) {

                    strong++;

                } else if ("Medium".equalsIgnoreCase(strength)) {

                    medium++;

                } else {

                    weak++;
                }

            } catch (Exception e) {

                System.out.println(
                        "Unable to evaluate password for credential ID: "
                                + credential.getId()
                );
            }
        }

        long total =
                strong + medium + weak;

        int healthScore = 0;

        if (total > 0) {

            healthScore =
                    (int) Math.round(
                            ((strong * 100.0)
                                    + (medium * 60.0)
                                    + (weak * 20.0))
                                    / total
                    );
        }

        return new PasswordHealthResponse(
                total,
                strong,
                medium,
                weak,
                healthScore
        );
    }
}