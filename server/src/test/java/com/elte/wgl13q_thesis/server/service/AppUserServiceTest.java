package com.elte.wgl13q_thesis.server.service;


import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.model.Gender;
import com.elte.wgl13q_thesis.server.repo.AppUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.*;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.SpringBootConfiguration;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDate;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.verify;

@ActiveProfiles("test")
@ExtendWith(MockitoExtension.class)
@SpringBootConfiguration
@Slf4j
public class AppUserServiceTest {

//    @Mock
    private AppUserService appUserService;
    @Mock
    private AppUserRepository appUserRepository;
    @Captor
    ArgumentCaptor<AppUser> appUserCaptor;
    @Captor
    ArgumentCaptor<Long> longCaptor;
    @Captor
    ArgumentCaptor<String> stringCaptor;

    @BeforeEach
    public void init() {
        MockitoAnnotations.openMocks(this);
        appUserService = new AppUserService(appUserRepository);
    }

    @Test
    public void addNewUser() {
        String username = "test_user";
        String email = "test@user.com";
        String firstName = "test_user_firstname";
        String lastName = "test_user_lastname";
        String password = "test_user_password";
        Gender gender = Gender.MALE;
        AppUserRole userRole = AppUserRole.USER;
        LocalDate dob = LocalDate.of(2000, 10, 20);
        AppUser appUser = new AppUser(
                username,
                password,
                firstName,
                lastName,
                userRole,
                dob,
                email,
                gender
        );
        appUserService.addNewUser(appUser);
        verify(appUserRepository).save(appUserCaptor.capture());
        String usernameFromCapture = appUserCaptor.getValue().getUsername();
        String firstNameFromCapture = appUserCaptor.getValue().getFirstName();
        String lastNameFromCapture = appUserCaptor.getValue().getLastName();
        String passwordFromCapture = appUserCaptor.getValue().getPassword();
        String emailFromCapture = appUserCaptor.getValue().getEmail();
        Gender genderFromCapture = appUserCaptor.getValue().getGender();
        AppUserRole roleFromCapture = appUserCaptor.getValue().getRole();
        LocalDate dobFromCapture = appUserCaptor.getValue().getDob();

        assertThat(usernameFromCapture).isNotNull();
        assertThat(firstNameFromCapture).isNotNull();
        assertThat(lastNameFromCapture).isNotNull();
        assertThat(passwordFromCapture).isNotNull();
        assertThat(emailFromCapture).isNotNull();
        assertThat(roleFromCapture).isNotNull();
        assertThat(genderFromCapture).isNotNull();
        assertThat(dobFromCapture).isNotNull();

        assertThat(usernameFromCapture).isEqualTo(username);
        assertThat(firstNameFromCapture).isEqualTo(firstName);
        assertThat(lastNameFromCapture).isEqualTo(lastName);
        assertThat(emailFromCapture).isEqualTo(email);
        assertThat(genderFromCapture).isEqualTo(gender);
        assertThat(roleFromCapture).isEqualTo(userRole);
        assertThat(dobFromCapture).isEqualTo(dob);

    }

    @Test
    public void deleteUser() {
        String username = "testuser";
        String email = "test@user.com";
        String firstName = "Test";
        String lastName = "User";
        String password = "test_user_password";
        Gender gender = Gender.MALE;
        AppUserRole userRole = AppUserRole.USER;
        LocalDate dob = LocalDate.of(2000, 10, 20);
        AppUser appUser = new AppUser(
                username,
                password,
                firstName,
                lastName,
                userRole,
                dob,
                email,
                gender
        );
        appUserService.addNewUser(appUser);
        verify(appUserRepository).findUserByUsername(stringCaptor.capture());
        String usernameFromCaptor = stringCaptor.getValue();
        appUserRepository.deleteById(1L);
        verify(appUserRepository).deleteById(longCaptor.capture());
        Long userIdFromCaptor = longCaptor.getValue();
        assertThat(userIdFromCaptor ).isNotNull();
        assertThat(usernameFromCaptor).isNotNull();
        assertThat(username).isEqualTo(usernameFromCaptor);
        assertThrows(UsernameNotFoundException.class,() -> {
            appUserService.deleteUser(username);
        });
    }

    @Test
    public void updateUser() {
        String username = "test_user";
        String email = "test@user.com";
        String firstName = "test_user_firstname";
        String lastName = "test_user_lastname";
        String password = "test_user_password";
        Gender gender = Gender.MALE;
        AppUserRole userRole = AppUserRole.USER;
        LocalDate dob = LocalDate.of(2000, 10, 20);
        AppUser appUser = new AppUser(
                username,
                password,
                firstName,
                lastName,
                userRole,
                dob,
                email,
                gender
        );
        appUserService.addNewUser(appUser);
        String newUsername = "test_user_new";
        String newEmail = "test_new@user.com";
        String newFirstName = "test_user_new_firstname";
        String newLastName = "test_user_new_lastname";
        String newPassword = "test_user_new_password";
        Gender newGender = Gender.FEMALE;
        AppUserRole newUserRole = AppUserRole.ADMIN;
        LocalDate newDob = LocalDate.of(2000, 12, 15);
        AppUser newUser = new AppUser(
                newUsername,
                newPassword,
                newFirstName,
                newLastName,
                newUserRole,
                newDob,
                newEmail,
                newGender
        );


        verify(appUserRepository).findUserByUsername(stringCaptor.capture());
        verify(appUserRepository).save(appUserCaptor.capture());
        appUserRepository.findUserByUsername(username);
        assertThrows(UsernameNotFoundException.class,() -> {
            appUserService.deleteUser(username);
        });
    }

    @Test
    public void fetchUserFromDB() {
        String username = "test_user";
        String email = "test@user.com";
        String firstName = "test_user_firstname";
        String lastName = "test_user_lastname";
        String password = "test_user_password";
        Gender gender = Gender.MALE;
        AppUserRole userRole = AppUserRole.USER;
        LocalDate dob = LocalDate.of(2000, 10, 20);
        AppUser appUser = new AppUser(
                username,
                password,
                firstName,
                lastName,
                userRole,
                dob,
                email,
                gender
        );
        appUserService.addNewUser(appUser);
        assertThrows(UsernameNotFoundException.class,() -> {
            appUserService.fetchUserFromDB(username);
        });
    }

}
