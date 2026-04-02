package com.esa.service;

import com.esa.model.Notification;
import com.esa.model.User;
import com.esa.repository.NotificationRepository;
import com.esa.repository.UserRepository;
import com.esa.util.RoleEnum;
import org.springframework.stereotype.Service;
import java.time.LocalDateTime;
import java.util.List;
import java.util.ArrayList;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(NotificationRepository notificationRepository, UserRepository userRepository) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    /**
     * BROADCAST (Production Style)
     * Creates personal context-bound notifications for each member of a team and all admins.
     */
    public void broadcast(Notification template) {
        List<User> recipients = new ArrayList<>();
        
        // 1. Target Team Members
        if (template.getTargetTeam() != null && !template.getTargetTeam().isBlank()) {
            recipients.addAll(userRepository.findByTeam(template.getTargetTeam()));
        }

        // 2. Admins (Safety net)
        userRepository.findAll().stream()
                .filter(u -> u.getRole() == RoleEnum.ADMIN)
                .forEach(admin -> {
                    if (recipients.stream().noneMatch(r -> r.getEmail().equals(admin.getEmail()))) {
                        recipients.add(admin);
                    }
                });

        // 3. Fallback: If no team members or admins found, just use the sender (unlikely)
        if (recipients.isEmpty() && template.getOwnerEmail() != null) {
            saveOne(template, template.getOwnerEmail());
            return;
        }

        for (User user : recipients) {
            saveOne(template, user.getEmail());
        }
    }

    public void saveOne(Notification template, String ownerEmail) {
        Notification n = new Notification();
        n.setTitle(template.getTitle());
        n.setMessage(template.getMessage());
        n.setType(template.getType());
        n.setOwnerEmail(ownerEmail);
        n.setSenderEmail(template.getSenderEmail() != null ? template.getSenderEmail() : "system");
        n.setIncidentId(template.getIncidentId());
        n.setIncidentStatus(template.getIncidentStatus());
        n.setTargetTeam(template.getTargetTeam());
        n.setTimestamp(LocalDateTime.now());
        n.setRead(false);
        notificationRepository.save(n);
    }
}
