package com.contactmanager.backend.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.contactmanager.backend.entity.Contact;

public interface ContactRepository extends JpaRepository<Contact, Long> {

    @Query("""
            SELECT c FROM Contact c
            WHERE (:search = '' OR
                LOWER(COALESCE(c.firstName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR
                LOWER(COALESCE(c.lastName, '')) LIKE LOWER(CONCAT('%', :search, '%')) OR
                EXISTS (SELECT e.id FROM EmailAddress e WHERE e.contact = c
                    AND LOWER(e.email) LIKE LOWER(CONCAT('%', :search, '%'))) OR
                EXISTS (SELECT p.id FROM PhoneNumber p WHERE p.contact = c
                    AND p.phoneNumber LIKE CONCAT('%', :search, '%')))
            AND (:title = '' OR c.title = :title)
            """)
    Page<Contact> findContacts(
            @Param("search") String search,
            @Param("title") String title,
            Pageable pageable);

    @Query("SELECT DISTINCT c.title FROM Contact c WHERE c.title IS NOT NULL AND c.title <> '' ORDER BY c.title")
    List<String> findDistinctTitles();

}
