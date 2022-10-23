package com.elte.wgl13q_thesis.server.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.service.AppUserService;
import com.elte.wgl13q_thesis.server.util.AuthUtils;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.FORBIDDEN;
import static org.springframework.http.HttpStatus.UNAUTHORIZED;
import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;


@RestController
@RequestMapping(path = "api/v1/user")
//@CrossOrigin(origins = {"http://localhost:3000", "http://127.0.0.1:3000","http://192.168.0.218:3000","*"})

@Slf4j
public class AppUserController {

    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

//    @GetMapping(path = "{userId}")
//    public ResponseEntity<?> getUser(@PathVariable("userId") Long userId) throws IllegalStateException {
//        try {
//            return new ResponseEntity<AppUser>(appUserService.fetchUserFromDB(userId), HttpStatus.OK);
//        } catch (Exception e) {
//            return new ResponseEntity<String>("error : User with id `" + userId + "` does not exist.", HttpStatus.NOT_FOUND);
//        }
//    }

    @GetMapping(path = "{username}")
    public ResponseEntity<?> getUser(@PathVariable("username") String username) throws IllegalStateException {
        try {
            return new ResponseEntity<AppUser>(appUserService.fetchUserFromDB(username), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<String>("error : User with username `" + username + "` does not exist.", HttpStatus.NOT_FOUND);
        }
    }

    @GetMapping(path = "/all")
    public List<AppUser> getUsers() {
        return appUserService.getUsers();
    }

    @PostMapping(value = "/new")
    public ResponseEntity<String> registerNewUser(@RequestBody AppUser appUser) {
        LocalDate dob = LocalDate.parse(appUser.getDob().toString(), DateTimeFormatter.ISO_DATE);
        String message = "";
        AppUser user = new AppUser(appUser.getUsername()
                , appUser.getPassword()
                , appUser.getFirstName()
                , appUser.getLastName()
                , appUser.getRole() != null ? appUser.getRole() : AppUserRole.USER
                , dob
                , appUser.getEmail()
                , appUser.getGender());
        if (appUserService.isUsernameTaken(user.getUsername())) {
            message = String.format("Username %s already taken !", user.getUsername());
            log.info(message);
            return new ResponseEntity<String>(message, HttpStatus.CONFLICT);
        }

        if (appUserService.isEmailTaken(user.getEmail())) {
            message = String.format("Email %s already taken !", user.getEmail());
            log.info(message);
            return new ResponseEntity<String>(message, HttpStatus.CONFLICT);
        }
        boolean created = appUserService.addNewUser(user);
        return new ResponseEntity<String>("New user created!", HttpStatus.CREATED);
    }

    @DeleteMapping(path = "{username}")
    public ResponseEntity<String> deleteUser(@PathVariable("username") String username, HttpServletResponse response) throws Exception {
        try {
            appUserService.deleteUser(username);
            return new ResponseEntity<String>("User " + username + " deleted!", HttpStatus.OK);
        } catch (Exception exception) {
            AuthUtils.authErrorLogger(response, HttpStatus.NOT_FOUND, exception);
            return new ResponseEntity<String>("Failed to delete user!", HttpStatus.NOT_FOUND);
        }
    }

    //    @PutMapping(path = "/updateUserDetails/{username}")
//    public ResponseEntity<String> updateUserDetails(@PathVariable("username") String username,
//                                                    @RequestParam(required = true) String firstName,
//                                                    @RequestParam(required = true) String lastName,
//                                                    @RequestParam(required = true) String email,
//                                                    @RequestParam(required = true)String password) {
//        appUserService.updateUser(username, firstName, lastName, email, password);
//        return new ResponseEntity<String>("User updated!", HttpStatus.OK);
//    }

    @PutMapping(path = "/updateUser/{username}")
    public ResponseEntity<String> updateUserDetails(@PathVariable("username") String username,
                                                    @RequestBody AppUser appUser, HttpServletResponse response) throws Exception {

        try {
            appUserService.updateUser(username, appUser);
            return new ResponseEntity<String>("User updated!", HttpStatus.OK);
        } catch (Exception exception) {
            AuthUtils.authErrorLogger(response, FORBIDDEN, exception);
            return new ResponseEntity<String>("Cannot update user!", FORBIDDEN);
        }
    }

//    @PutMapping(path = "/updateUserDetails/{userId}")
//    public void updateUserFirstName(
//            @PathVariable("userId") Long userId,
//            @RequestParam(required = true) String firstName,
//            @RequestParam(required = false) String email) {
//        appUserService.updateUserFirstName(userId, firstName, email);
//    }

//    @PatchMapping(path = "userId")
//    public void removeUserRole(
//            @PathVariable("userId") Long userId,
//            @RequestParam(required = true) AppUserRole role
//    ) {
//        appUserService.removeUserRole(userId, role);
//    }

    @GetMapping(path = "/token/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                String refreshToken = authorizationHeader.substring("Bearer ".length());
                Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
                JWTVerifier verifier = JWT.require(algorithm).build();
                DecodedJWT decodedJWT = verifier.verify(refreshToken);
                log.info(decodedJWT.getToken());
                String username = decodedJWT.getSubject();
                AppUser user = appUserService.fetchUserFromDB(username);
                log.info(user.getUsername() + " 's role :  " + user.getRole().toString());
                String accessToken = JWT.create()
                        .withSubject(user.getUsername())
                        .withExpiresAt(new Date(System.currentTimeMillis() + 10 * 60 * 1000))
                        .withIssuer(request.getRequestURL().toString())
                        .withClaim("roles", new ArrayList<>(Arrays.asList(user.getRole().toString())))
                        .sign(algorithm);

                log.info("refresh_token : " + refreshToken);
                log.info("access_token : " + accessToken);
                AuthUtils.putAccessAndRefreshTokensInBody(response, accessToken, refreshToken);
                AuthUtils.setAccessAndRefreshTokensInHeader(response, accessToken, refreshToken);
            } catch (Exception exception) {
                AuthUtils.authErrorLogger(response, FORBIDDEN, exception);
            }
        } else {
            response.setHeader("error ", "Refresh token is missing");
            response.setStatus(UNAUTHORIZED.value());
            Map<String, String> errors = new HashMap<>();
            errors.put("error:", "Refresh token is missing");
            new ObjectMapper().writeValue(response.getOutputStream(), errors);
//            throw new RuntimeException("Refresh token is missing.");
        }
    }

    @PatchMapping(path = "/addRole/{userId}")
    public void updateUserRole(
            @PathVariable("userId") Long userId,
            @RequestParam(required = true) AppUserRole role
    ) {
        appUserService.updateUserRole(userId, role);
    }
}
