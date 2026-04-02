package com.esa.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "dependencies")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DependencyEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String source;

    @Column(nullable = false)
    private String target;

    private String type; // e.g. sync-rest, async-mq

    private String risk; // e.g. Low, Medium, High
}
