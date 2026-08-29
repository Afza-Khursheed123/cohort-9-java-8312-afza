package com.contactmanager.backend.service;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertSame;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Optional;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.contactmanager.backend.entity.Contact;
import com.contactmanager.backend.entity.EmailAddress;
import com.contactmanager.backend.entity.PhoneNumber;
import com.contactmanager.backend.entity.User;
import com.contactmanager.backend.entity.User.IdentifierType;
import com.contactmanager.backend.repository.ContactRepository;
import com.contactmanager.backend.repository.UserRepository;

@ExtendWith(MockitoExtension.class)
class ContactServiceTests {

    @Mock
    private ContactRepository contactRepository;
    @Mock
    private UserRepository userRepository;

    private ContactService service;

    @BeforeEach
    void setUp() {
        service = new ContactService(contactRepository, userRepository);
    }

    @Test
    void saveAssignsAuthenticatedOwnerAndChildRelationships() {
        User owner = new User("Test", "User", "test@example.com", IdentifierType.EMAIL, "hash");
        Contact contact = new Contact();
        EmailAddress email = new EmailAddress();
        PhoneNumber phone = new PhoneNumber();
        contact.getEmailAddresses().add(email);
        contact.getPhoneNumbers().add(phone);
        when(userRepository.getReferenceById(7L)).thenReturn(owner);
        when(contactRepository.save(contact)).thenReturn(contact);

        Contact saved = service.saveContact(7L, contact);

        assertSame(owner, saved.getOwner());
        assertSame(contact, email.getContact());
        assertSame(contact, phone.getContact());
    }

    @Test
    void updateReturnsMissingWhenContactIsNotOwnedByUser() {
        when(contactRepository.findByIdAndOwnerId(22L, 7L)).thenReturn(Optional.empty());

        assertNull(service.updateContact(7L, 22L, new Contact()));
        verify(contactRepository, never()).save(org.mockito.ArgumentMatchers.any());
    }

    @Test
    void deleteDoesNotRevealOrDeleteAnotherUsersContact() {
        when(contactRepository.findByIdAndOwnerId(22L, 7L)).thenReturn(Optional.empty());

        assertFalse(service.deleteContact(7L, 22L));
        verify(contactRepository, never()).delete(org.mockito.ArgumentMatchers.any());
    }
}
