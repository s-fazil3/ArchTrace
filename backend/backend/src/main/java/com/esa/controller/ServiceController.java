package com.esa.controller;

import com.esa.model.ServiceEntity;
import com.esa.repository.ServiceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/services")
public class ServiceController {

    private final ServiceRepository serviceRepository;
    private final com.esa.service.HealthMonitorService healthMonitorService;

    public ServiceController(ServiceRepository serviceRepository,
                             com.esa.service.HealthMonitorService healthMonitorService) {
        this.serviceRepository = serviceRepository;
        this.healthMonitorService = healthMonitorService;
    }

    @PostMapping("/scan-health")
    public ResponseEntity<Void> scanHealth() {
        healthMonitorService.simulateHealthStatus();
        return ResponseEntity.ok().build();
    }

    @GetMapping
    public List<ServiceEntity> getAllServices() {
        return serviceRepository.findAll();
    }

    @PostMapping
    public ServiceEntity createService(@RequestBody ServiceEntity service) {
        return serviceRepository.save(service);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ServiceEntity> updateService(@PathVariable Long id, @RequestBody ServiceEntity updated) {
        return serviceRepository.findById(id).map(existing -> {
            if (updated.getName() != null) existing.setName(updated.getName());
            if (updated.getTeam() != null) existing.setTeam(updated.getTeam());
            if (updated.getTech() != null) existing.setTech(updated.getTech());
            if (updated.getEndpoint() != null) existing.setEndpoint(updated.getEndpoint());
            if (updated.getVersion() != null) existing.setVersion(updated.getVersion());
            if (updated.getStatus() != null) existing.setStatus(updated.getStatus());
            if (updated.getDependenciesCount() != null) existing.setDependenciesCount(updated.getDependenciesCount());
            existing.setHealthCheckUrl(updated.getHealthCheckUrl()); // allow null to clear it
            
            try {
                return ResponseEntity.ok(serviceRepository.save(existing));
            } catch (Exception e) {
                return ResponseEntity.internalServerError().<ServiceEntity>build();
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteService(@PathVariable Long id) {
        return serviceRepository.findById(id).map(service -> {
            serviceRepository.delete(service);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
