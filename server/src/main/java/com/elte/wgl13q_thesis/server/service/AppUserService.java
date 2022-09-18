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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.servlet.ServletException;
import java.time.LocalDate;
import java.util.*;

@Service // bean
@Slf4j
public class AppUserService implements UserDetailsService {

    private final AppUserRepository appUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired // dependency injection
    public AppUserService(AppUserRepository appUserRepository) {
        this.appUserRepository = appUserRepository;
    }

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
        log.info("User {} authorities :  {} ", username, authorities);

        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

    public UserDetails loadUserAndCheckPassword(String username, String password) throws ServletException {
        AppUser user = appUserRepository.findUserByUsername(username);
        if (user == null) {
            log.error("User {} not found in the database", username);
            throw new UsernameNotFoundException("User {} not found in the database");
        } else {
            log.info("User {} found in the database", username);
            log.info("Fetching details for user");
        }
        String passwordFromDb = appUserRepository.findPasswordByUsername(username);
        if (!passwordFromDb.equals(passwordEncoder.encode(password))) {
            log.error("User {} password incorrect", username);
            throw new ServletException("User {} not authenticated");
        }
        Collection<SimpleGrantedAuthority> authorities = new ArrayList<>();
        authorities.add(new SimpleGrantedAuthority(user.getRole().name()));
        return new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), authorities);
    }

    public List<AppUser> getUsers() {
        return appUserRepository.findAll();
    }

    public AppUser fetchUserFromDB(Long userId) {
        return appUserRepository.findById(userId).orElseThrow(() -> new IllegalStateException("User with id " + userId + " does not exist"));
    }

    public AppUser fetchUserFromDB(String username) throws IllegalStateException {
        try {
            return appUserRepository.findUserByUsername(username);
        } catch (IllegalStateException e) {
            throw new IllegalStateException("User with username " + username + " does not exist");
        }
    }

    public boolean addNewUser(AppUser appUser) {
        if (isEmailTaken(appUser.getEmail())) {
            throw new IllegalStateException("Email taken!");
        }
        AppUser user = new AppUser();
        user.setEmail(appUser.getEmail());
        user.setUsername(appUser.getUsername());
        user.setPassword(passwordEncoder.encode(appUser.getPassword()));
        user.setId(appUser.getId());
        user.setRole(appUser.getRole());
        user.setFirstName(appUser.getFirstName());
        user.setLastName(appUser.getLastName());
        user.setDob(appUser.getDob());
        user.setGender(appUser.getGender());
        appUserRepository.save(user);
        return true;
    }

    public void deleteUser(String username) {
        try {
            AppUser user = appUserRepository.findUserByUsername(username);
            deleteUser(user.getId());
            log.info("User with id  {} deleted", user.getId());
        } catch (Exception exception) {
            throw new IllegalStateException("User with username " + username + " does not exist");
        }
    }

    public void deleteUser(Long userId) {
        boolean exists = appUserRepository.existsById(userId);
        if (exists) {
            appUserRepository.deleteById(userId);
        } else {
            throw new IllegalStateException("User with id " + userId + " does not exist");
        }
    }

    public void updateUser(String username, AppUser givenAppUser) {

        try {
            AppUser appUser = fetchUserFromDB(username);
            if (!username.equals(appUser.getUsername())) {
                throw new IllegalStateException("You do not have permission to update this user!");
            }
            log.info("User fetched : {}", appUser.getUsername());
            if (givenAppUser.getFirstName() != null && givenAppUser.getFirstName().length() > 0 && !Objects.equals(appUser.getFirstName(), givenAppUser.getFirstName())) {
                log.info("{} is getting a new first name : {}", appUser.getUsername(), givenAppUser.getFirstName());
                appUser.setFirstName(givenAppUser.getFirstName());
            }
            if (givenAppUser.getLastName() != null && givenAppUser.getLastName().length() > 0 && !Objects.equals(appUser.getLastName(), givenAppUser.getLastName())) {
                log.info("{} is getting a new last name : {}", appUser.getUsername(), givenAppUser.getLastName());
                appUser.setLastName(givenAppUser.getLastName());
            }
            if (givenAppUser.getEmail() != null && givenAppUser.getEmail().length() > 0 && !Objects.equals(appUser.getEmail(), givenAppUser.getEmail())) {
                if (isEmailTaken(givenAppUser.getEmail())) {
                    throw new IllegalStateException("Email taken!");
                }
                log.info("{} is getting a new email : {}", appUser.getUsername(), givenAppUser.getEmail());
                appUser.setEmail(givenAppUser.getEmail());
            }
            if (givenAppUser.getDob() != null && !givenAppUser.getDob().equals(appUser.getDob()) && givenAppUser.getDob().isAfter(LocalDate.parse("1940-01-01")) && givenAppUser.getDob().isBefore(LocalDate.parse("2022-01-01"))) {
                log.info("{} is getting a new birth date : {} ", appUser.getUsername(), givenAppUser.getDob().toString().formatted("yyyy-mm-dd"));
                appUser.setDob(givenAppUser.getDob());
            }
            if (givenAppUser.getGender() != null) {
                log.info("{} is getting a new gender : {} ", appUser.getUsername(), givenAppUser.getGender().toString());
                appUser.setGender(givenAppUser.getGender());
            } else {
                log.info("{} is NOT getting a new gender : {} ", appUser.getUsername(), givenAppUser.getGender().toString());
            }
            if (givenAppUser.getPassword() != null && givenAppUser.getPassword().length() > 6) {
                log.info("{} is getting a new password", appUser.getUsername());
                appUser.setPassword(passwordEncoder.encode(givenAppUser.getPassword()));
            }
            appUserRepository.save(appUser);
        } catch (Exception e) {
            throw new IllegalStateException(e.getMessage());
        }
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


    public boolean isEmailTaken(String email) {
        Optional<AppUser> userOptional = appUserRepository.findUserByEmail(email);
        return userOptional.isPresent();
    }


}