package com.contactmanager.backend.controller;

import java.util.List;
import org.springframework.web.bind.annotation.CrossOrigin;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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

    @GetMapping
    public List<Contact> getContacts() {
        return contactService.getAllContacts();
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
