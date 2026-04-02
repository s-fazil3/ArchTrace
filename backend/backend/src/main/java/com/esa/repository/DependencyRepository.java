package com.esa.repository;

import com.esa.model.DependencyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface DependencyRepository extends JpaRepository<DependencyEntity, Long> {
}
