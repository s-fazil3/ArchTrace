package com.esa.repository;

import com.esa.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    Optional<User> findByName(String name);
    Optional<User> findByNameIgnoreCase(String name);
    List<User> findByTeam(String team);
    Boolean existsByEmail(String email);
}
