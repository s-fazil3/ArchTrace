package com.esa;

import com.esa.model.ServiceEntity;
import com.esa.model.Team;
import com.esa.model.User;
import com.esa.repository.ServiceRepository;
import com.esa.repository.TeamRepository;
import com.esa.repository.UserRepository;
import com.esa.util.RoleEnum;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.transaction.annotation.Transactional;

import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@EnableScheduling
@EntityScan("com.esa.model")
@EnableJpaRepositories("com.esa.repository")
public class EsaApplication {

    public static void main(String[] args) {
        SpringApplication.run(EsaApplication.class, args);
    }

    @Bean
    @Transactional
    public CommandLineRunner seedData(UserRepository userRepository, TeamRepository teamRepository, 
                                    ServiceRepository serviceRepository, BCryptPasswordEncoder passwordEncoder) {
        return args -> {
            try {
                if (userRepository.findByEmail("admin@gmail.com").isEmpty()) {
                    User admin = new User();
                    admin.setName("System Admin"); admin.setEmail("admin@gmail.com"); admin.setPassword(passwordEncoder.encode("admin123"));
                    admin.setRole(RoleEnum.ADMIN); admin.setTeam("System");
                    userRepository.save(admin);
                }
            } catch (Exception e) {
                System.err.println("WARN: Data seeding skipped or failed: " + e.getMessage());
            }
        };
    }
}
