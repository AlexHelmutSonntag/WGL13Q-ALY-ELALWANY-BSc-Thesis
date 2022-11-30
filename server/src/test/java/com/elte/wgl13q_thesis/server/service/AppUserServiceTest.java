package com.elte.wgl13q_thesis.server.service;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.model.Gender;
import com.elte.wgl13q_thesis.server.repo.AppUserRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.TestConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.mockito.Mockito.verify;

@Slf4j
@ExtendWith({MockitoExtension.class})
class AppUserServiceTest {

    @TestConfiguration
    public static class TestConfig {
        @Bean
        public PasswordEncoder passwordEncoder(){
            return new BCryptPasswordEncoder();
        }
    }

    @Mock
    private AppUserRepository appUserRepository;
    private AutoCloseable autoCloseable;
    private AppUserService underTest;

    @BeforeEach
    void setUp() {
        autoCloseable = MockitoAnnotations.openMocks(this);
        underTest = new AppUserService(appUserRepository);

    }

    @AfterEach
    void tearDown() throws Exception {
        autoCloseable.close();
    }

    @Test
    void getUsers() {
        underTest.getUsers();
        verify(appUserRepository).findAll();
    }

    @Test
    @Disabled
    void loadUserByUsername() {
        String username = "test_user";
        String email = "test@user.com";
        AppUser appUser = new AppUser(
                username,
                "test_user_password",
                "test_user_firstname",
                "test_user_lastname",
                AppUserRole.USER,
                LocalDate.of(2000, 10, 20),
                email,
                Gender.OTHER);
        appUserRepository.save(appUser);
        log.info(appUserRepository.findAll().toString());
        underTest.loadUserByUsername(username);
        verify(appUserRepository).findUserByUsername(username);
    }

    @Test
    void fetchUserFromDBWithUsername() {
        String username = "test_user";
        underTest.fetchUserFromDB(username);
        verify(appUserRepository).findUserByUsername(username);
    }

    @Test
    void testFetchUserFromDBWithId() {
        Long userId = 1L;
        underTest.fetchUserFromDB(userId);
        ArgumentCaptor<Long> userIdArgumentCaptor = ArgumentCaptor.forClass(Long.class);
        verify(appUserRepository).findById(userIdArgumentCaptor.capture());
        Long capturedId = userIdArgumentCaptor.getValue();
        assertThat(capturedId).isEqualTo(userId);

    }

    @Test
    void addNewUser() {
        String username = "test_user";
        String email = "test@user.com";
        AppUser appUser = new AppUser(
                username,
                "test_user_password",
                "test_user_firstname",
                "test_user_lastname",
                AppUserRole.USER,
                LocalDate.of(2000, 10, 20),
                email,
                Gender.OTHER
        );

        underTest.addNewUser(appUser);

        ArgumentCaptor<AppUser> appUserArgumentCaptor = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserRepository).save(appUserArgumentCaptor.capture());

        AppUser capturedUser = appUserArgumentCaptor.getValue();
        assertThat(capturedUser).isEqualTo(appUser);

    }

    @Test
    @Disabled
    void deleteUser() {
        String username = "test_user";
        String email = "test@user.com";
        AppUser appUser = new AppUser(
                username,
                "test_user_password",
                "test_user_firstname",
                "test_user_lastname",
                AppUserRole.USER,
                LocalDate.of(2000, 10, 20),
                email,
                Gender.OTHER
        );
        appUserRepository.save(appUser);

        underTest.deleteUser(username);

        ArgumentCaptor<Long> userIdArgumentCaptor = ArgumentCaptor.forClass(Long.class);
        verify(appUserRepository).deleteById(userIdArgumentCaptor.capture());

        Long capturedId = userIdArgumentCaptor.getValue();
        log.info(capturedId.toString());
        assertThat(capturedId).isEqualTo(appUser.getId());
    }

    @Test
    @Disabled
    void testDeleteUser() {
    }

    @Test
    @Disabled
    void updateUser() {
    }

    @Test
    @Disabled
    void updateUserFirstName() {
    }

    @Test
    @Disabled
    void updateUserRole() {
    }

    @Test
    void isEmailTaken() {
        String email = "test_email";
        underTest.isEmailTaken(email);
        verify(appUserRepository).findUserByEmail(email);
    }

    @Test
    void isUsernameTaken() {
        String username = "test_username";
        underTest.isUsernameTaken(username);
        verify(appUserRepository).findUserByUsername(username);
    }
}