package com.elte.wgl13q_thesis.server.controller;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTDecodeException;
import com.auth0.jwt.exceptions.TokenExpiredException;
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
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

import static java.util.Arrays.stream;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpStatus.*;


@RestController
@RequestMapping(path = "api/v1/user")
@Slf4j
public class AppUserController {

    private final AppUserService appUserService;

    @Autowired
    public AppUserController(AppUserService appUserService) {
        this.appUserService = appUserService;
    }

    @GetMapping(path = "{username}")
    public ResponseEntity<?> getUser(@PathVariable("username") String username) throws IllegalStateException {
        try {
            return new ResponseEntity<AppUser>(appUserService.fetchUserFromDB(username), HttpStatus.OK);
        } catch (UsernameNotFoundException e) {
            return new ResponseEntity<String>("error : User with username `" + username + "` does not exist.", HttpStatus.NOT_FOUND);
        } catch (Exception e) {
            return new ResponseEntity<String>("Server error when fetching user: `" + username, INTERNAL_SERVER_ERROR);
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
        log.info("user : " + user.getUsername() + " created!");
        return new ResponseEntity<String>("New user created!", HttpStatus.CREATED);
    }

    @DeleteMapping(path = "{username}")
    public ResponseEntity<String> deleteUser(@RequestHeader(AUTHORIZATION) String authorizationHeader, @PathVariable("username") String username, HttpServletResponse response) throws Exception {
        try {
            String accessToken = authorizationHeader.substring("Bearer ".length());
            log.info("Access Token : " + accessToken);
            DecodedJWT decodedJWT = AuthUtils.createDecodedJWT(authorizationHeader);
            String usernameFromToken = AuthUtils.getUsernameFromDecodedJWT(decodedJWT);
            String[] roles = AuthUtils.getRolesFromDecodedJWT(decodedJWT);
            log.info(usernameFromToken);
            log.info(username);
            log.info(Arrays.toString(roles));
            if (usernameFromToken.equals(username) || stream(roles).anyMatch(role -> role.equalsIgnoreCase("ADMIN"))) {
                appUserService.deleteUser(username);
                return new ResponseEntity<String>("User " + username + " deleted", HttpStatus.OK);
            }
            return new ResponseEntity<String>("Not authorized to delete user : " + username, FORBIDDEN);
        } catch (UsernameNotFoundException exception) {
            AuthUtils.authErrorLogger(response, NOT_FOUND, exception);
            return new ResponseEntity<String>("User " + username + " not found", NOT_FOUND);
        } catch (Exception exception) {
            AuthUtils.authErrorLogger(response, INTERNAL_SERVER_ERROR, exception);
            return new ResponseEntity<String>("Failed to delete user", INTERNAL_SERVER_ERROR);
        }
    }

    @PutMapping(path = "/updateUser/{username}")
    public ResponseEntity<?> updateUserDetails(@RequestHeader(AUTHORIZATION) String authorizationHeader, @PathVariable("username") String username,
                                               @RequestBody AppUser appUser, HttpServletResponse response) throws Exception {
        try {
            String accessToken = authorizationHeader.substring("Bearer ".length());
            log.info("Access Token : " + accessToken);
            DecodedJWT decodedJWT = AuthUtils.createDecodedJWT(authorizationHeader);
            String usernameFromToken = AuthUtils.getUsernameFromDecodedJWT(decodedJWT);
            String[] roles = AuthUtils.getRolesFromDecodedJWT(decodedJWT);
            log.info(usernameFromToken);
            log.info(username);
            log.info(Arrays.toString(roles));
            AppUser userFromDB = appUserService.fetchUserFromDB(username);
            if (userFromDB == null) {
                throw new UsernameNotFoundException("User " + username + " does not exist");
            }
            if (usernameFromToken.equals(username) || stream(roles).anyMatch(role -> role.equalsIgnoreCase("ADMIN"))) {
                appUserService.updateUser(username, appUser);
                AppUser updatedAppUser = appUserService.fetchUserFromDB(username);
                return new ResponseEntity<AppUser>(updatedAppUser, HttpStatus.OK);
            }
            AuthUtils.authErrorLogger(response, FORBIDDEN, new Exception("Not authorized to update the user"));
            return new ResponseEntity<String>("Cannot update user", FORBIDDEN);
        } catch (UsernameNotFoundException exception) {
            AuthUtils.authErrorLogger(response, NOT_FOUND, exception);
            return new ResponseEntity<String>("User does not exist", NOT_FOUND);
        } catch (Exception exception) {
            AuthUtils.authErrorLogger(response, INTERNAL_SERVER_ERROR, exception);
            return new ResponseEntity<String>("Cannot update user!", INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "/token/refresh")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws Exception {
        String authorizationHeader = request.getHeader(AUTHORIZATION);
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            try {
                String refreshToken = authorizationHeader.substring("Bearer ".length());
                Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
                DecodedJWT decodedJWT = JWT.decode(refreshToken);
                log.info(decodedJWT.getSubject());
                String username = decodedJWT.getSubject();
                AppUser user = appUserService.fetchUserFromDB(username);
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

            } catch (UsernameNotFoundException | NullPointerException exception) {
                AuthUtils.authErrorLogger(response, NOT_FOUND, exception);
            }catch(JWTDecodeException exception){
                AuthUtils.authErrorLogger(response, FORBIDDEN, exception);
            }
        } else {
            response.setHeader("error", "Refresh token is missing");
            response.setStatus(BAD_REQUEST.value());
            Map<String, String> errors = new HashMap<>();
            errors.put("error:", "Refresh token is missing");
            new ObjectMapper().writeValue(response.getOutputStream(), errors);
        }
    }


}
