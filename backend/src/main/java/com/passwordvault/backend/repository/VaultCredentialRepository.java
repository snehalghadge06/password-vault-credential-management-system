package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.VaultCredential;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VaultCredentialRepository extends JpaRepository<VaultCredential, Long> {

    List<VaultCredential> findByUserId(Long userId);

}