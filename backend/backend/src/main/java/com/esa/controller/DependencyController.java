package com.esa.controller;

import com.esa.model.DependencyEntity;
import com.esa.repository.DependencyRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dependencies")
public class DependencyController {

    private final DependencyRepository repository;

    public DependencyController(DependencyRepository repository) {
        this.repository = repository;
    }

    @GetMapping
    public List<DependencyEntity> getAll() {
        return repository.findAll();
    }

    @PostMapping
    public DependencyEntity create(@RequestBody DependencyEntity dependency) {
        return repository.save(dependency);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }
}
