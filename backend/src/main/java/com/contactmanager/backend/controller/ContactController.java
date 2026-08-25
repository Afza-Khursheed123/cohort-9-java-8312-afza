package com.contactmanager.backend.controller;

import java.util.List;
import java.util.Set;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.ResponseEntity;

import com.contactmanager.backend.entity.Contact;
import com.contactmanager.backend.service.ContactService;
@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/contacts")
public class ContactController {

    private final ContactService contactService;

    public ContactController(ContactService contactService) {
        this.contactService = contactService;
    }

    @PostMapping
    public Contact createContact(@RequestBody Contact contact) {
        contact.setId(null);
        return contactService.saveContact(contact);
    }

    private static final int DEFAULT_PAGE_SIZE = 9;
    private static final int MAX_PAGE_SIZE = 100;
    private static final Set<String> ALLOWED_SORT_FIELDS = Set.of("firstName", "title", "email");

    @GetMapping
    public Page<Contact> getContacts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "" + DEFAULT_PAGE_SIZE) int size,
            @RequestParam(defaultValue = "") String search,
            @RequestParam(defaultValue = "") String title,
            @RequestParam(defaultValue = "firstName") String sort) {
        int safePage = Math.max(page, 0);
        int safeSize = Math.min(Math.max(size, 1), MAX_PAGE_SIZE);
        String safeSort = ALLOWED_SORT_FIELDS.contains(sort) ? sort : "firstName";
        if ("email".equals(safeSort)) {
            safeSort = "emailAddresses.email";
        }
        Sort contactSort = Sort.by(Sort.Order.asc(safeSort).ignoreCase(), Sort.Order.asc("id"));
        return contactService.getContacts(search, title, PageRequest.of(safePage, safeSize, contactSort));
    }

    @GetMapping("/titles")
    public List<String> getContactTitles() {
        return contactService.getContactTitles();
    }
    @GetMapping("/{id}")
    public ResponseEntity<Contact> getContact(@PathVariable("id") Long id) {
        Contact contact = contactService.getContactById(id);
        return contact == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(contact);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteContact(@PathVariable("id") Long id) {
        if (contactService.getContactById(id) == null) {
            return ResponseEntity.notFound().build();
        }
        contactService.deleteContact(id);
        return ResponseEntity.ok("Contact Deleted Successfully");
    }

    @PutMapping("/{id}")
    public ResponseEntity<Contact> updateContact(
            @PathVariable("id") Long id,
            @RequestBody Contact contact) {
        Contact updatedContact = contactService.updateContact(id, contact);
        return updatedContact == null ? ResponseEntity.notFound().build() : ResponseEntity.ok(updatedContact);
    }
}
