package com.contactmanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.contactmanager.backend.entity.User;

public interface UserRepository extends JpaRepository<User, Long> {
    boolean existsByIdentifier(String identifier);
}
