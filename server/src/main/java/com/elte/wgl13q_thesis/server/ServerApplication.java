package com.elte.wgl13q_thesis.server;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.repo.AppUserRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;

import static com.elte.wgl13q_thesis.server.model.AppUserRole.ADMIN;
import static com.elte.wgl13q_thesis.server.model.AppUserRole.USER;
import static java.time.Month.JANUARY;
import static java.time.Month.SEPTEMBER;
@SpringBootApplication
public class ServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(ServerApplication.class, args);
    }



    @Bean
    CommandLineRunner commandLineRunner(AppUserRepository repository) {
        return args -> {
            AppUser mariam = new AppUser(
                    "mariam21", "password", "Mariam", "Lobrecht", USER,
                    LocalDate.of(2000, JANUARY, 5),
                    "mariam@gmail.com");
            AppUser ali = new AppUser(
                    "ali99", "password", "Ali", "Magdi", ADMIN,
                    LocalDate.of(1999, SEPTEMBER, 3),
                    "aly@gmail.com");
            AppUser anna = new AppUser(
                    "annasmith", "password", "Anna", "Smith", ADMIN,
                    LocalDate.of(1999, SEPTEMBER, 3),
                    "annasmith@gmail.com");
            repository.saveAll(List.of(mariam, ali,anna));
        };
    }

}
