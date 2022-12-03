package com.elte.wgl13q_thesis.server.service;


import org.mockito.Mockito;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.context.annotation.Profile;

@Profile("test")
@Configuration
public class AppUserServiceTestConfig {

//    @Bean
//    @Primary
//    public AppUserService appUserService(){
//        return Mockito.mock(AppUserService.class);
//    }
}
