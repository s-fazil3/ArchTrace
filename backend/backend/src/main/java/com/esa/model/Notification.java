package com.esa.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    private String title;
    private String message;
    private String type; // e.g., "danger", "info", "warning", "success"
    
    /**
     * The owner of this notification record (personal inbox).
     */
    private String ownerEmail;

    /**
     * Who originally triggered this notification.
     * Could be "system" or an admin email.
     */
    private String senderEmail = "system";

    /**
     * Optional ID to group related notifications for the same issue.
     * Used for the Resolve -> Acknowledge lifecycle.
     */
    private String incidentId;

    /**
     * Status in the lifecycle: 
     * PENDING (new) | RESOLVED (handled by lead) | CLOSED (acknowledged by sender)
     */
    private String incidentStatus; // null if not an incident
    
    private boolean isRead = false;
    private LocalDateTime timestamp = LocalDateTime.now();
    
    // Which team this is for (to allow permissions check for RESOLVE button)
    private String targetTeam;
}
