package com.elte.wgl13q_thesis.server.util;

import io.restassured.RestAssured;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;

import static java.net.HttpURLConnection.HTTP_OK;

@Slf4j
public class TestUtils {


    public static String BASE_URL = System.getProperty("base-url");
    public static String AUTH_USER_USERNAME = System.getProperty("auth-user-username");
    public static String AUTH_USER_SECRET = System.getProperty("auth-user-secret");


    public static String getJWTWithCredentials(String username,String password){
        BASE_URL = System.getProperty("base-url");
        log.info(BASE_URL);
        RestAssured.baseURI = BASE_URL;
        RequestSpecification request = RestAssured.given();
        request.header("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        request.formParam("username", username)
                .formParam("password", password);
        Response response = request.post("login");
        Assertions.assertEquals(HTTP_OK,response.getStatusCode());
        String accessToken =response.jsonPath().get("access_token");
        log.info(accessToken);
        return accessToken;
    }
}
