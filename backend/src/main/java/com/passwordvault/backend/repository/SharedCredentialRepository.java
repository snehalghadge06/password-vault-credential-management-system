package com.passwordvault.backend.repository;

import com.passwordvault.backend.entity.SharedCredential;
import org.springframework.data.jpa.repository.JpaRepository;
import com.passwordvault.backend.entity.User;
import java.util.List;
import java.util.Optional;

public interface SharedCredentialRepository extends JpaRepository<SharedCredential, Long> {

    List<SharedCredential> findBySharedWith(User user);

    Optional<SharedCredential> findByCredentialIdAndSharedWith(
            Long credentialId,
            User sharedWith
    );

}