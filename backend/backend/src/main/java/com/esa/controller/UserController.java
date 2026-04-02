package com.esa.controller;

import com.esa.model.User;
import com.esa.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers() {
        return ResponseEntity.ok(userRepository.findAll());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String roleStr = body.get("role");
        return userRepository.findById(id).map(user -> {
            try {
                user.setRole(com.esa.util.RoleEnum.valueOf(roleStr.toUpperCase()));
                userRepository.save(user);
                return ResponseEntity.ok().build();
            } catch (IllegalArgumentException e) {
                return ResponseEntity.badRequest().body("Invalid role");
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/team")
    public ResponseEntity<?> updateTeam(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String team = body.get("team");
        return userRepository.findById(id).map(user -> {
            user.setTeam(team);
            userRepository.save(user);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }
}
