package com.elte.wgl13q_thesis.server.controller;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.service.AppUserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.List;


@RestController
@RequestMapping(path = "api/v1/user")
@CrossOrigin(origins="http://localhost:3000")
@Slf4j
public class AppUserController {

    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @GetMapping(path = "{userId}")
    public ResponseEntity<AppUser> getUser(@PathVariable("userId") Long userId) {
        return new ResponseEntity<AppUser>(appUserService.getUser(userId),HttpStatus.OK);
    }

    @GetMapping
    public List<AppUser> getUsers() {
        return appUserService.getUsers();
    }

    @PostMapping(value = "/new")
    public ResponseEntity<String> registerNewUser(@RequestBody AppUser appUser) {
        LocalDate dob = LocalDate.parse(appUser.getDob().toString(), DateTimeFormatter.ISO_DATE);
        AppUser user;
        if (appUser.getRole() == null) {
            user = new AppUser(appUser.getUsername(), appUser.getPassword(), appUser.getFirstName(), appUser.getLastName(), AppUserRole.USER, dob, appUser.getEmail());
        } else {
            user = new AppUser(appUser.getUsername(), appUser.getPassword(), appUser.getFirstName(), appUser.getLastName(), appUser.getRole(),dob, appUser.getEmail());
        }
        if(appUserService.addNewUser(user)){
            return new ResponseEntity<String>("New user created!", HttpStatus.CREATED);
        }
        return new ResponseEntity<String>("User failed to create!", HttpStatus.CONFLICT);
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


    @PostMapping(path="/login")
    public ResponseEntity<String> loginUser(
            @RequestParam(required = true) String username,
            @RequestParam(required = true) String password) {

        log.info("username : " + username);
        log.info("password : " + password);

        return new ResponseEntity<String>("User login",HttpStatus.OK);
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
