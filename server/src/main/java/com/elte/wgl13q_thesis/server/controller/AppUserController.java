package com.elte.wgl13q_thesis.server.controller;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.service.AppUserService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.net.URI;
import java.util.List;


@RestController
@RequestMapping(path = "api/v1/user")
public class AppUserController {

    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }


    @GetMapping(path = "{userId}")
    public AppUser getUser(@PathVariable("userId") Long userId) {
        return appUserService.getUser(userId);
    }

    @GetMapping
    public List<AppUser> getUsers() {
        return appUserService.getUsers();
    }

    @PostMapping(value = "/new")
    public void registerNewUser(@RequestBody AppUser appUser) {
        appUserService.addNewUser(appUser);
    }

    @DeleteMapping(path = "{userId}")
    public void deleteUser(@PathVariable("userId") Long userId) {
        appUserService.deleteUser(userId);
    }

    @PutMapping(path = "/updateUserDetails/{userId}")
    public void updateUserFirstName(
            @PathVariable("userId") Long userId,
            @RequestParam(required = true) String firstName,
            @RequestParam(required = false) String email) {
        appUserService.updateUserFirstName(userId, firstName, email);
    }

//    @PatchMapping(path = "userId")
//    public void removeUserRole(
//            @PathVariable("userId") Long userId,
//            @RequestParam(required = true) AppUserRole role
//    ) {
//        appUserService.removeUserRole(userId, role);
//    }

    @PatchMapping(path = "/addRole/{userId}")
    public void updateUserRole(
            @PathVariable("userId") Long userId,
            @RequestParam(required = true) AppUserRole role
    ) {
        appUserService.updateUserRole(userId, role);
    }
}
