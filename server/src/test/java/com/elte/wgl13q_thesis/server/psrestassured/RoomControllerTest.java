package com.elte.wgl13q_thesis.server.psrestassured;

import com.elte.wgl13q_thesis.server.model.Language;
import com.elte.wgl13q_thesis.server.model.ProficiencyLevel;
import com.elte.wgl13q_thesis.server.model.RoomRequestBody;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;

import static java.net.HttpURLConnection.*;

@Slf4j
public class RoomControllerTest {
    private static final String testRootPath = Objects.requireNonNull(Thread.currentThread().getContextClassLoader().getResource("")).getPath();
    private static final String testConfigPath = testRootPath + "test.properties";
    protected static final Map<String, String> env = new ProcessBuilder().environment();
    public static String BASE_URL = "";
    //    ="http://localhost:8080/"
    //    ="http://192.168.0.218:8080/"
    public static String AUTH_USER_USERNAME = "";
    public static String AUTH_USER_SECRET = "";
    public static String AUTH_ADMIN_USERNAME = "";
    public static String AUTH_ADMIN_SECRET = "";

    @BeforeAll
    public static void setup() throws IOException {
        envSetup();
        RestAssured.baseURI = BASE_URL;
    }

    public static void envSetup() throws IOException {
        Properties testProps = new Properties();
        testProps.load(Files.newInputStream(Paths.get(testConfigPath)));
        String certPassword = testProps.getProperty("cert-password");
        String pathToJKS = testProps.getProperty("server.ssl.key-store");
        AUTH_USER_USERNAME = testProps.getProperty("auth-user-username");
        AUTH_USER_SECRET = testProps.getProperty("auth-user-secret");
        AUTH_ADMIN_USERNAME = testProps.getProperty("auth-admin-username");
        AUTH_ADMIN_SECRET = testProps.getProperty("auth-admin-secret");
        BASE_URL = testProps.getProperty("base-url");
        RestAssured.useRelaxedHTTPSValidation();
        RestAssured.config().getSSLConfig().with().keyStore(pathToJKS, certPassword);
    }

    public static void authSetupWithCredentials(String username, String password) {
        RequestSpecification request = RestAssured.given();
        request.header("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        request.formParam("username", username)
                .formParam("password", password);
        Response response = request.post("login");
        env.put("access_token", response.jsonPath().get("access_token"));
    }

    @Test
    public void shouldCreateRoomTest(){
        authSetupWithCredentials(AUTH_USER_USERNAME,AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        String roomId = "1";
        String uuId = "ac309a95-2ae5-450d-bfbd-24f1be34531y";
        ProficiencyLevel proficiencyLevel = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        RoomRequestBody roomRequestBody = new RoomRequestBody(roomId,uuId,proficiencyLevel,language);
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(roomRequestBody)
                .and()
                .auth()
                .oauth2(accessToken)
                .post("/api/v1/room/new")
                .then()
                .extract()
                .response();

        log.info(String.valueOf(response.getStatusCode()));
        log.info(response.jsonPath().getString(""));
        Assertions.assertEquals(HTTP_CREATED, response.getStatusCode());
    }

    @Test
    public void shouldFailOnCreateRoomTestWithInvalidToken(){
        String roomId = "1";
        String uuId = "ac309a95-2ae5-450d-bfbd-24f1be34531y";
        ProficiencyLevel proficiencyLevel = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        RoomRequestBody roomRequestBody = new RoomRequestBody(roomId,uuId,proficiencyLevel,language);
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .body(roomRequestBody)
                .and()
                .post("/api/v1/room/new")
                .then()
                .extract()
                .response();
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldFailOnCreateRoomTestWithEmptyBody(){
        authSetupWithCredentials(AUTH_USER_USERNAME,AUTH_USER_SECRET);
        String accessToken = env.get("access_token");

        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .body("")
                .auth()
                .oauth2(accessToken)
                .post("/api/v1/room/new")
                .then()
                .extract()
                .response();

        log.info(String.valueOf(response.getStatusCode()));
        log.info(response.jsonPath().getString(""));
        Assertions.assertEquals(HTTP_BAD_REQUEST, response.getStatusCode());
    }

    @Test
    public void shouldGetAllRooms(){
        authSetupWithCredentials(AUTH_USER_USERNAME,AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .auth()
                .oauth2(accessToken)
                .get("/api/v1/room/all")
                .then()
                .extract()
                .response();
        log.info(String.valueOf(response.getStatusCode()));
        log.info(response.jsonPath().getString(""));
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
    }

    @Test
    public void shouldFailOnGetAllRoomsWithInvalidToken(){
        Response response = RestAssured
                .given()
                .get("/api/v1/room/all")
                .then()
                .extract()
                .response();
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }



}
