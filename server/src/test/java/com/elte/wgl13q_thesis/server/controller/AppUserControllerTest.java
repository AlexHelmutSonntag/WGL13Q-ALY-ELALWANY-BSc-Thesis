package com.elte.wgl13q_thesis.server.controller;

import com.elte.wgl13q_thesis.server.ServerApplication;
import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.repo.AppUserRepository;
import com.elte.wgl13q_thesis.server.service.AppUserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.junit.jupiter.params.ParameterizedTest;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.reactive.server.WebTestClient;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;

import static org.assertj.core.api.AssertionsForClassTypes.assertThat;
import static org.assertj.core.api.AssertionsForClassTypes.contentOf;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;


//@ExtendWith(SpringExtension.class)
//@SpringBootTest(
//        classes = ServerApplication.class
//)
//@AutoConfigureMockMvc
//@TestPropertySource(locations = "src/test/java/resources/test.properties")
class AppUserControllerTest {
//
//    @Autowired
//    private MockMvc mvc;
//
//    Calculator underTest = new Calculator();
//
//    @Test
//    void itsShouldAddTwoNumbers(@Autowired WebTestClient webClient) {
//        webClient.get().uri("/").exchange().expectStatus().isOk();
//
//        //given
//        int numberOne = 20;
//        int numberTwo = 30;
//        //when
//        int result = underTest.add(numberOne, numberTwo);
//
//        //then
//        int expected = 50;
//        assertThat(result).isEqualTo(expected);
//
//    }

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
//class Calculator {
//    int add(int a, int b) {
//        return a + b;
//    }
//}