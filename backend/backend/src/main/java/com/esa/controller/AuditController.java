package com.esa.controller;

import com.esa.model.AuditLog;
import com.esa.repository.AuditLogRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.data.domain.Sort;

@RestController
@RequestMapping("/api/audit")
@CrossOrigin(origins = "http://localhost:5173")
public class AuditController {

    private final AuditLogRepository repository;

    public AuditController(AuditLogRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<AuditLog> getAll() {
        return repository.findAll(Sort.by(Sort.Direction.DESC, "timestamp"));
    }

    @PostMapping
    public AuditLog create(@RequestBody AuditLog log) {
        return repository.save(log);
    }

    @DeleteMapping
    @org.springframework.transaction.annotation.Transactional
    public org.springframework.http.ResponseEntity<?> deleteAll() {
        try {
            repository.deleteAll();
            return org.springframework.http.ResponseEntity.ok().build();
        } catch (Exception e) {
            e.printStackTrace();
            return org.springframework.http.ResponseEntity.internalServerError().body("Error deleting logs: " + e.getMessage());
        }
    }
}
