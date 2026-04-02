package com.esa.controller;

import com.esa.model.AuditLog;
import com.esa.model.Notification;
import com.esa.repository.AuditLogRepository;
import com.esa.repository.NotificationRepository;
import com.esa.service.NotificationService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/notifications")
@CrossOrigin(origins = "http://localhost:5173")
public class NotificationController {

    private final NotificationRepository repository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;

    public NotificationController(NotificationRepository repository, 
                                  AuditLogRepository auditLogRepository,
                                  NotificationService notificationService) {
        this.repository = repository;
        this.auditLogRepository = auditLogRepository;
        this.notificationService = notificationService;
    }

    @GetMapping
    public List<Notification> getAll(Authentication auth) {
        if (auth == null) return List.of();
        String email = auth.getName();
        return repository.findByOwnerEmailOrderByTimestampDesc(email);
    }

    @PostMapping
    @Transactional
    public ResponseEntity<Void> create(@RequestBody Notification notification, Authentication auth) {
        String senderEmail = (auth != null) ? auth.getName() : "system";
        notification.setSenderEmail(senderEmail);
        
        if (notification.getTargetTeam() != null && !notification.getTargetTeam().isBlank()) {
            if (notification.getIncidentId() == null) {
                notification.setIncidentId(UUID.randomUUID().toString().substring(0, 8));
            }
            if (notification.getIncidentStatus() == null) {
                notification.setIncidentStatus("PENDING");
            }
            notificationService.broadcast(notification);
        } else {
            if (notification.getOwnerEmail() == null) notification.setOwnerEmail(senderEmail);
            repository.save(notification);
        }
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/resolve")
    @Transactional
    public ResponseEntity<Void> resolveIncident(@PathVariable Long id, @RequestBody(required = false) Map<String, String> payload, Authentication auth) {
        try {
            return repository.findById(id).map(originalNotif -> {
                if (auth == null || !originalNotif.getOwnerEmail().equals(auth.getName())) {
                    return ResponseEntity.status(403).<Void>build();
                }

                String reason = (payload != null) ? payload.getOrDefault("reason", "Resolved by Lead.") : "Resolved by Lead.";
                String incidentId = originalNotif.getIncidentId();
                String sender = (originalNotif.getSenderEmail() != null) ? originalNotif.getSenderEmail() : "system";
                String oldTitle = (originalNotif.getTitle() != null) ? originalNotif.getTitle() : "Incident #" + id;
                String team = (originalNotif.getTargetTeam() != null) ? originalNotif.getTargetTeam() : "General";

                // 1. Mark ALL related notifications in EVERY user's inbox as resolved
                if (incidentId != null && !incidentId.isBlank()) {
                    List<Notification> related = repository.findByIncidentId(incidentId);
                    for (Notification n : related) {
                        n.setIncidentStatus("RESOLVED");
                        n.setRead(true);
                        repository.save(n);
                    }
                } else {
                    // Fallback for informational alerts with no ID
                    originalNotif.setIncidentStatus("RESOLVED");
                    originalNotif.setRead(true);
                    repository.save(originalNotif);
                }

                // 2. Notify the person who created this alert (The "Resolution Handshake")
                Notification ack = new Notification();
                ack.setTitle("✅ Resolved: " + oldTitle.replace("Incident #", "").replace("Alert: ", ""));
                ack.setMessage("The reported issue for '" + oldTitle + "' has been resolved by the [" + team + "] Lead.\nNotes: " + reason);
                ack.setType("success");
                ack.setOwnerEmail(sender); 
                ack.setSenderEmail(auth.getName());
                ack.setIncidentId(incidentId != null ? incidentId : "ack-" + id);
                ack.setIncidentStatus("AWAITING_ACK");
                ack.setTimestamp(LocalDateTime.now());
                repository.save(ack);

                // 3. Global Audit Log
                AuditLog log = new AuditLog();
                log.setTarget(oldTitle);
                log.setUserName(auth.getName());
                log.setAction("Incident RESOLVED globally by Lead for [" + team + "]. " + reason);
                log.setType("recovery");
                auditLogRepository.save(log);

                return ResponseEntity.ok().<Void>build();
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().build();
        }
    }

    @PostMapping("/{id}/acknowledge")
    @Transactional
    public ResponseEntity<Void> acknowledge(@PathVariable Long id, Authentication auth) {
        try {
            return repository.findById(id).map(originalNotif -> {
                if (auth == null || !originalNotif.getOwnerEmail().equals(auth.getName())) {
                    return ResponseEntity.status(403).<Void>build();
                }

                String incidentId = originalNotif.getIncidentId();

                // 1. Close ALL related notifications globally (all inboxes)
                if (incidentId != null && !incidentId.isBlank()) {
                    List<Notification> related = repository.findByIncidentId(incidentId);
                    for (Notification n : related) {
                        n.setIncidentStatus("CLOSED");
                        n.setRead(true);
                        repository.save(n);
                    }
                } else {
                    originalNotif.setIncidentStatus("CLOSED");
                    originalNotif.setRead(true);
                    repository.save(originalNotif);
                }

                return ResponseEntity.ok().<Void>build();
            }).orElse(ResponseEntity.notFound().build());
        } catch (Exception e) {
            return ResponseEntity.status(500).build();
        }
    }

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(@PathVariable Long id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(403).build();
        return repository.findById(id).map(notif -> {
            if (!notif.getOwnerEmail().equals(auth.getName())) return ResponseEntity.status(403).<Notification>build();
            notif.setRead(true);
            return ResponseEntity.ok(repository.save(notif));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id, Authentication auth) {
        if (auth == null) return ResponseEntity.status(403).build();
        return repository.findById(id).map(notif -> {
            if (!notif.getOwnerEmail().equals(auth.getName())) return ResponseEntity.status(403).<Void>build();
            repository.deleteById(id);
            return ResponseEntity.ok().<Void>build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/clear-all")
    @Transactional
    public ResponseEntity<Void> clearAll(Authentication auth) {
        if (auth == null) return ResponseEntity.status(403).build();
        repository.deleteByOwnerEmail(auth.getName());
        return ResponseEntity.ok().build();
    }
}
