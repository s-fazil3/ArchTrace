package com.esa.controller;

import com.esa.model.ContactMessage;
import com.esa.repository.ContactMessageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/contact")
public class ContactController {

    private final ContactMessageRepository contactMessageRepository;

    public ContactController(ContactMessageRepository contactMessageRepository) {
        this.contactMessageRepository = contactMessageRepository;
    }

    @PostMapping
    public ResponseEntity<?> submitContact(@RequestBody ContactMessage message) {
        contactMessageRepository.save(message);
        return ResponseEntity.ok().build();
    }
}
