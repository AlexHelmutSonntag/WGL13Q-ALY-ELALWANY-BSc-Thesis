package com.elte.wgl13q_thesis.server.controller;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.repo.AppUserRepository;
import com.elte.wgl13q_thesis.server.service.AppUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.params.ParameterizedTest;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;

import java.time.LocalDate;

import static org.junit.jupiter.api.Assertions.*;

class AppUserControllerTest {

//    private final AppUserService appUserService;
//    private final AppUserRepository appUserRepository;

//    @Autowired
//    public AppUserControllerTest(AppUserService appUserService, AppUserRepository appUserRepository) {
//        this.appUserService = appUserService;
//        this.appUserRepository = appUserRepository;
//    }

//    @ParameterizedTest
//    void registerNewUser(@Mock AppUserService appUserService,@Mock AppUserRepository appUserRepository) {
//        AppUser appUser = new AppUser("testUser","password123","Test","User", AppUserRole.USER,LocalDate.parse("1999-26-1"),"test@user.com");
//        AppUserController controller = new AppUserController(appUserService);
//        ResponseEntity<String>  response = controller.registerNewUser(appUser);
//        assertEquals(response.getStatusCode().value(),201);
//    }
}