package com.elte.wgl13q_thesis.server;


import com.elte.wgl13q_thesis.server.controller.AppUserController;
import com.elte.wgl13q_thesis.server.service.AppUserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;


//@SpringBootTest(classes = ServerApplication.class)
public class AppUserIT {
    MockMvc mockMvc;

    @Autowired
    private AppUserService appUserService;

    @BeforeEach
    void setup() {

        this.mockMvc = MockMvcBuilders.standaloneSetup(new AppUserController(appUserService))
                .defaultRequest(
                        post("/")
                                .accept(MediaType.APPLICATION_JSON))
                .build();
    }

    @Test
    public void testLogin() throws Exception {
        mockMvc.perform(get("/api/v1/user/all"))
                .andDo(print())
                .andExpect(content().string(""));
    }

}
