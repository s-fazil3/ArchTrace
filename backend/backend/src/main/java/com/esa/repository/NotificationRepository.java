package com.esa.repository;

import com.esa.model.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findByOwnerEmailOrderByTimestampDesc(String ownerEmail);
    void deleteByOwnerEmail(String ownerEmail);
    List<Notification> findByIncidentId(String incidentId);
}
