package com.esa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "services")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ServiceEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String team;

    private String tech;

    private String endpoint;

    private String version;

    private String status = "Healthy";

    private Integer dependenciesCount = 0;

    /**
     * Optional full URL of the service's health endpoint.
     * e.g. "http://localhost:3001/health" or "https://my-service.com/actuator/health"
     * If not set, status must be managed manually or via the scan simulation.
     */
    private String healthCheckUrl;
}
