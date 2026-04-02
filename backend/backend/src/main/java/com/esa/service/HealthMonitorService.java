package com.esa.service;

import com.esa.model.AuditLog;
import com.esa.model.Notification;
import com.esa.model.ServiceEntity;
import com.esa.repository.AuditLogRepository;
import com.esa.repository.ServiceRepository;
import org.springframework.stereotype.Service;

import java.net.HttpURLConnection;
import java.net.URL;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class HealthMonitorService {

    private final ServiceRepository serviceRepository;
    private final AuditLogRepository auditLogRepository;
    private final NotificationService notificationService;

    private static final int TIMEOUT_MS       = 3000;
    private static final int WARNING_LATENCY  = 500;
    private static final int CRITICAL_LATENCY = 1500;

    public HealthMonitorService(ServiceRepository serviceRepository,
                                AuditLogRepository auditLogRepository,
                                NotificationService notificationService) {
        this.serviceRepository = serviceRepository;
        this.auditLogRepository = auditLogRepository;
        this.notificationService = notificationService;
    }

    public void runHealthChecks() {
        List<ServiceEntity> services = serviceRepository.findAll();

        for (ServiceEntity service : services) {
            String healthUrl = service.getHealthCheckUrl();
            if (healthUrl == null || healthUrl.isBlank()) continue;

            String previousStatus = service.getStatus() != null ? service.getStatus() : "Healthy";
            String newStatus = pingService(healthUrl);

            if (newStatus.equals(previousStatus)) continue;

            service.setStatus(newStatus);
            serviceRepository.save(service);

            String incidentId = UUID.randomUUID().toString().substring(0, 8);
            String type = "info";
            String action = "";
            String status = null;

            if ("Critical".equals(newStatus)) {
                action = "CRITICAL FAILURE detected on service: [" + service.getName() + "]. ";
                type = "danger";
                status = "PENDING";
            } else if ("Warning".equals(newStatus)) {
                action = "DEGRADED PERFORMANCE detected on service: [" + service.getName() + "]. ";
                type = "warning";
                status = "PENDING";
            } else {
                action = "SERVICE RECOVERY: [" + service.getName() + "] has returned to healthy.";
                type = "success";
                status = "RECOVERY";
            }

            AuditLog audit = new AuditLog();
            audit.setTarget(service.getName());
            audit.setUserName("System Monitor");
            audit.setAction(action + "(Incident ID: " + incidentId + ")");
            audit.setType(type.equals("danger") ? "critical" : type);
            auditLogRepository.save(audit);

            // B-ROADCAST to TEAM (1:1 per user records)
            Notification template = new Notification();
            template.setTitle("Health Alert: " + service.getName());
            template.setMessage(action);
            template.setType(type);
            template.setTargetTeam(service.getTeam());
            template.setIncidentId(incidentId);
            template.setIncidentStatus(status);
            template.setSenderEmail("system-monitor");
            notificationService.broadcast(template);
        }
    }

    private String pingService(String healthUrl) {
        HttpURLConnection connection = null;
        try {
            long start = System.currentTimeMillis();
            URL url = new URL(healthUrl);
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.setConnectTimeout(TIMEOUT_MS);
            connection.setReadTimeout(TIMEOUT_MS);
            int code = connection.getResponseCode();
            long latency = System.currentTimeMillis() - start;

            if (code >= 200 && code < 300) {
                if (latency > CRITICAL_LATENCY) return "Critical";
                if (latency > WARNING_LATENCY) return "Warning";
                return "Healthy";
            }
            return "Critical";
        } catch (Exception e) {
            return "Critical";
        } finally {
            if (connection != null) connection.disconnect();
        }
    }

    public void simulateHealthStatus() {
        runHealthChecks();
    }
}
