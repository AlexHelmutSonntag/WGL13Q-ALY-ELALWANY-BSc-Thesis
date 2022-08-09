package com.elte.wgl13q_thesis.server.service;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.repo.AppUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service // bean
@Slf4j
public class AppUserService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        AppUser user = appUserRepository.findUserByUsername(username);
        if (user == null) {
            log.error("User {} not found in the database", username);
            throw new UsernameNotFoundException("User {} not found in the database");
        } else {
            log.info("User {} found in the database", username);
        }
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

    @Autowired // dependency injection
    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

    public List<AppUser> getUsers() {
        return appUserRepository.findAll();
    }

    public AppUser getUser(Long userId) {
        return appUserRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
    }

    public void addNewUser(AppUser appUser) {
        if (isEmailTaken(appUser.getEmail())) {
            throw new IllegalStateException("Email taken!");
        }
        appUserRepository.save(appUser);
    }


    public void deleteUser(Long userId) {
        boolean exists = appUserRepository.existsById(userId);
        if (!exists) {
            throw new IllegalStateException("User with id " + userId + " does not exist");
        }
        appUserRepository.deleteById(userId);
    }

    public void updateUserFirstName(Long userId, String firstName, String email) {
        AppUser appUser = fetchUserFromDB(userId);
        log.info("User fetched : {}", appUser.getUsername());
        if (firstName != null && firstName.length() > 0 && !Objects.equals(appUser.getFirstName(), firstName)) {
            log.info("{} is getting a new first name : {}", appUser.getUsername(), firstName);
            appUser.setFirstName(firstName);
        }
        if (email != null && email.length() > 0 && !Objects.equals(appUser.getEmail(), email)) {
            if (isEmailTaken(email)) {
                throw new IllegalStateException("Email taken!");
            }
            log.info("{} is getting a new email : {}", appUser.getUsername(), email);
            appUser.setEmail(email);
        }
        appUserRepository.save(appUser);
    }

    public void updateUserRole(Long userId, AppUserRole role) {
        AppUser appUser = fetchUserFromDB(userId);
        log.info("User fetched : {}", appUser.getUsername());
        appUser.setRole(role);
        log.info("Updating : user {} now has role : {}", appUser.getUsername(), role);
        appUserRepository.save(appUser);
    }

//    public void removeUserRole(Long userId, AppUserRole role) {
//        AppUser appUser = fetchUserFromDB(userId);
//        log.info("User fetched : {}", appUser.getUsername());
//        if (!appUser.getRoles().contains(role)) {
//            log.info("User {} does not have role {}", appUser.getUsername(), role);
//            return;
//        }
//        log.info("Removing role {} from user {}", role, appUser.getUsername());
//        appUser.getRoles().remove(role);
//    }


    private AppUser fetchUserFromDB(Long userId) {
        log.info("Fetching user with id : {}", userId);
        return appUserRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User with id {} does not exist" + userId + " does not exist"));
    }

    public boolean isEmailTaken(String email) {
        Optional<AppUser> userOptional = appUserRepository.findUserByEmail(email);
        return userOptional.isPresent();
    }


}
