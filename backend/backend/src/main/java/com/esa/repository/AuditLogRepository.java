package com.esa.repository;

import com.esa.model.AuditLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AuditLogRepository extends JpaRepository<AuditLog, Long> {

    // Find all logs of a specific type (e.g., "critical", "warning", "recovery")
    List<AuditLog> findByTypeOrderByTimestampDesc(String type);

    // Find all logs for a specific service
    List<AuditLog> findByTargetOrderByTimestampDesc(String target);
}
