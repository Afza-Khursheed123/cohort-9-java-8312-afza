package com.contactmanager.backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.contactmanager.backend.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {

}