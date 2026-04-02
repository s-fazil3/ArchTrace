package com.esa.controller;

import com.esa.model.Team;
import com.esa.repository.TeamRepository;
import com.esa.repository.UserRepository;
import com.esa.util.RoleEnum;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "http://localhost:5173")
public class TeamController {

    private final TeamRepository repository;
    private final UserRepository userRepository;

    public TeamController(TeamRepository repository, UserRepository userRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'DEVELOPER', 'TEAM_LEAD')")
    public List<Team> getAll() {
        return repository.findAll();
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN')")
    public Team create(@RequestBody Team team) {
        Team savedTeam = repository.save(team);
        syncUserAsLead(savedTeam.getTeamLead(), savedTeam.getName());
        return savedTeam;
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> delete(@PathVariable Long id) {
        return repository.findById(id).map(team -> {
            unlinkLead(team.getTeamLead(), team.getName());
            repository.deleteById(id);
            return ResponseEntity.ok().build();
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<Team> update(@PathVariable Long id, @RequestBody Team teamDetails) {
        return repository.findById(id).map(team -> {
            String oldName = team.getName();
            String oldLead = team.getTeamLead();
            
            team.setName(teamDetails.getName());
            team.setTeamLead(teamDetails.getTeamLead());
            team.setColor(teamDetails.getColor());
            Team updatedTeam = repository.save(team);

            // If lead changed or team name changed, handle unlinking/re-linking
            if (oldLead != null && (!oldLead.equals(updatedTeam.getTeamLead()) || !oldName.equals(updatedTeam.getName()))) {
                unlinkLead(oldLead, oldName);
            }
            
            syncUserAsLead(updatedTeam.getTeamLead(), updatedTeam.getName());

            return ResponseEntity.ok(updatedTeam);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/resync-leads")
    @PreAuthorize("hasAnyRole('ADMIN')")
    public ResponseEntity<?> resyncLeads() {
        List<Team> teams = repository.findAll();
        for (Team team : teams) {
            syncUserAsLead(team.getTeamLead(), team.getName());
        }
        return ResponseEntity.ok().build();
    }

    private Optional<com.esa.model.User> findLeadUser(String leadName) {
        if (leadName == null) return Optional.empty();
        String trimmed = leadName.trim();
        if (trimmed.isEmpty()) return Optional.empty();

        Optional<com.esa.model.User> user = userRepository.findByNameIgnoreCase(trimmed);
        if (user.isPresent()) return user;
        return userRepository.findByName(trimmed);
    }

    private void syncUserAsLead(String leadName, String teamName) {
        if (leadName == null || leadName.trim().isEmpty() || teamName == null) return;
        findLeadUser(leadName).ifPresent(user -> {
            user.setTeam(teamName);
            if (user.getRole() == RoleEnum.DEVELOPER) {
                user.setRole(RoleEnum.TEAM_LEAD);
            }
            userRepository.save(user);
            System.out.println("[ARCHTRACE] Synced: " + user.getName() + " is now Lead of " + teamName);
        });
    }

    private void unlinkLead(String leadName, String teamName) {
        if (leadName == null || leadName.trim().isEmpty()) return;
        findLeadUser(leadName).ifPresent(user -> {
            if (teamName != null && teamName.equals(user.getTeam())) {
                user.setTeam(null);
                userRepository.save(user);
                System.out.println("[ARCHTRACE] Unlinked: " + user.getName() + " from " + teamName);
            }
        });
    }
}
