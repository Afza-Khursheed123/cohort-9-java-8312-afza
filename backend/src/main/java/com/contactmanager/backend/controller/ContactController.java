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
        return contactService.saveContact(contact);
    }

    @GetMapping
    public List<Contact> getContacts() {
        return contactService.getAllContacts();
    }
    @GetMapping("/{id}")
public Contact getContact(@PathVariable Long id) {
    return contactService.getContactById(id);
}
@DeleteMapping("/{id}")
public String deleteContact(@PathVariable Long id) {

    contactService.deleteContact(id);

    return "Contact Deleted Successfully";
}


@PutMapping("/{id}")
public Contact updateContact(@PathVariable Long id,
                             @RequestBody Contact contact) {

    return contactService.updateContact(id, contact);
}
}