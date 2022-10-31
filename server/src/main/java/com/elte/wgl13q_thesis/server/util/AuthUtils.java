package com.elte.wgl13q_thesis.server.util;

import com.auth0.jwt.JWT;
import com.auth0.jwt.JWTVerifier;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.User;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Slf4j
public class AuthUtils {


    public static void authErrorLogger(HttpServletResponse response, HttpStatus status, Exception exception) throws Exception {
        log.error("Error in : {}", exception.getMessage());
        setHeaderAndStatus(response, status, "error", exception.getMessage());
        AuthUtils.putMessageInResponse(response, "error_message", exception.getMessage());
    }

    public static void setHeaderAndStatus(HttpServletResponse response, HttpStatus status, String key, String message) {
        response.setHeader(key, message);
        response.setStatus(status.value());
    }

    public static void putMessageInResponse(HttpServletResponse response, String key, String message) throws IOException {
        Map<String, String> responseData = new HashMap<>();
        responseData.put(key, message);
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), responseData);
    }

    public static DecodedJWT createDecodedJWT(String authorizationHeader) throws IOException {
        try {
            String token = authorizationHeader.substring("Bearer ".length());
            Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
            JWTVerifier verifier = JWT.require(algorithm).build();
            return verifier.verify(token);
        } catch (Exception e) {
            throw new IOException(e.getMessage());
        }
    }

    public static String getUsernameFromDecodedJWT(DecodedJWT decodedJWT){
        return decodedJWT.getSubject();
    }

    public static String[] getRolesFromDecodedJWT(DecodedJWT decodedJWT){
        return  decodedJWT.getClaim("roles").asArray(String.class);
    }
    public static void setAccessAndRefreshTokensInHeader(HttpServletResponse response, String accessToken, String refreshToken) {
        response.setHeader("access_token", accessToken);
        response.setHeader("refresh_token", refreshToken);
    }

    public static void putAccessAndRefreshTokensInBody(HttpServletResponse response, String accessToken, String refreshToken) throws IOException {
        Map<String, String> tokens = new HashMap<>();
        tokens.put("access_token", accessToken);
        tokens.put("refresh_token", refreshToken);
        response.setContentType(APPLICATION_JSON_VALUE);
        new ObjectMapper().writeValue(response.getOutputStream(), tokens);
    }

    public static void createAuthToken(HttpServletRequest request, HttpServletResponse response, Authentication authentication) throws IOException {
        User user = (User) authentication.getPrincipal();
        Algorithm algorithm = Algorithm.HMAC256("secret".getBytes());
        String accessToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 60 * 60 * 1000))
                .withIssuer(request.getRequestURL().toString())
                .withClaim("roles", user.getAuthorities().stream().map(GrantedAuthority::getAuthority).collect(Collectors.toList()))
                .sign(algorithm);
        String refreshToken = JWT.create()
                .withSubject(user.getUsername())
                .withExpiresAt(new Date(System.currentTimeMillis() + 120 * 60 * 1000))
                .withIssuer(request.getRequestURL().toString())
                .sign(algorithm);
        setAccessAndRefreshTokensInHeader(response, accessToken, refreshToken);
        putAccessAndRefreshTokensInBody(response, accessToken, refreshToken);
    }
}
