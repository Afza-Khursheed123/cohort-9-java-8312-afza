package com.contactmanager.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.contactmanager.backend.entity.Contact;
import com.contactmanager.backend.repository.ContactRepository;

@Service
public class ContactService {

    private final ContactRepository contactRepository;

    public ContactService(ContactRepository contactRepository) {
        this.contactRepository = contactRepository;
    }

   public Contact saveContact(Contact contact) {

    contact.getEmailAddresses().forEach(email -> email.setContact(contact));

    contact.getPhoneNumbers().forEach(phone -> phone.setContact(contact));

    return contactRepository.save(contact);
}

    public List<Contact> getAllContacts() {
        return contactRepository.findAll();
    }
    public Contact getContactById(Long id) {
    return contactRepository.findById(id).orElse(null);
}
public void deleteContact(Long id) {
    contactRepository.deleteById(id);
}
public Contact updateContact(Long id, Contact updatedContact) {

    Contact existing = contactRepository.findById(id).orElse(null);

    if (existing == null)
        return null;

    existing.setFirstName(updatedContact.getFirstName());
    existing.setLastName(updatedContact.getLastName());
    existing.setTitle(updatedContact.getTitle());

    existing.getEmailAddresses().clear();
    existing.getPhoneNumbers().clear();

    updatedContact.getEmailAddresses().forEach(email -> {
        email.setContact(existing);
        existing.getEmailAddresses().add(email);
    });

    updatedContact.getPhoneNumbers().forEach(phone -> {
        phone.setContact(existing);
        existing.getPhoneNumbers().add(phone);
    });

    return contactRepository.save(existing);
}
}