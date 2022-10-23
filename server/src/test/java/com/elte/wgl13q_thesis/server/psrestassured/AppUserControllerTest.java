package com.elte.wgl13q_thesis.server.psrestassured;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.model.Gender;
import io.restassured.config.SSLConfig;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import io.restassured.RestAssured;

import java.io.FileInputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.cert.CertificateException;
import java.time.LocalDate;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;

import static io.restassured.RestAssured.*;
import static java.net.HttpURLConnection.*;

@Slf4j
public class AppUserControllerTest {

    private static final String testRootPath = Objects.requireNonNull(Thread.currentThread().getContextClassLoader().getResource("")).getPath();
    private static final String testConfigPath = testRootPath + "test.properties";
    private static final Map<String, String> env = new ProcessBuilder().environment();


    public static String BASE_URL;
    //    = "http://localhost:8080/"
    public static String AUTH_CLIENT_USERNAME;
    public static String AUTH_CLIENT_SECRET;




    @BeforeAll
    public static void setup() throws IOException {
        envSetup();
        RestAssured.baseURI = BASE_URL;
    }

    public static void envSetup() throws IOException {
        Properties testProps = new Properties();
        testProps.load(Files.newInputStream(Paths.get(testConfigPath)));
        String certPassword = testProps.getProperty("cert-password");
        AUTH_CLIENT_USERNAME = testProps.getProperty("auth-client-username");
        AUTH_CLIENT_SECRET = testProps.getProperty("auth-client-secret");
        BASE_URL = testProps.getProperty("base-url");
        RestAssured.useRelaxedHTTPSValidation();
        RestAssured.config().getSSLConfig().with().keyStore("classpath:keystore/new_cert-1.p12",certPassword);
    }

    public static void authSetup() {
        RequestSpecification request = RestAssured.given();
        request.header("Content-type", "application/x-www-form-urlencoded; charset=utf-8");
        request.formParam("username", AUTH_CLIENT_USERNAME)
                .formParam("password", AUTH_CLIENT_SECRET);
        Response response = request.post("login");
        env.put("access_token", response.jsonPath().get("access_token"));
    }

    @Test
    public void shouldLogin() {
        Response response = RestAssured
                .given()
                .header("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
                .formParam("username", AUTH_CLIENT_USERNAME)
                .formParam("password", AUTH_CLIENT_SECRET)
                .post("login");

        log.info(String.valueOf(response.getStatusCode()));
        log.info(response.jsonPath().get("access_token"));
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
    }

    @Test
    public void shouldFailOnLoginWithNoCredentials() {
        Response response = RestAssured.given().post("login");
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldFailOnLoginWithInvalidCredentials() {
        Response response = RestAssured
                .given()
                .header("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
                .formParam("username", "wrong_username")
                .formParam("password", "wrong_password")
                .post("login");

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldFailOnLoginWithValidUsernameAndInvalidPassword() {
        Response response = RestAssured
                .given()
                .header("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
                .formParam("username", AUTH_CLIENT_USERNAME)
                .formParam("password", "wrong_password")
                .post("login");

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldGetAllUsers() throws IOException {
        authSetup();
        String accessToken = env.get("access_token");
        Response response =
                given()
                        .auth()
                        .oauth2(accessToken).
                        get("/api/v1/user/all")
                        .then()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        log.info(String.valueOf(response.jsonPath().getString("")));

        Assertions.assertEquals(HTTP_OK, response.getStatusCode());

    }

    @Test
    public void shouldFailOnGetAllUsers() {
        Response response =
                get("/api/v1/user/all")
                        .then()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldFailOnGetAllUsersWithInvalidToken() {
        Response response =
                given()
                        .auth()
                        .oauth2("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpX").
                        get("/api/v1/user/all")
                        .then()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        log.info(String.valueOf(response.jsonPath().getString("")));

        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldCreateNewUser() {

        AppUser appUser = new AppUser(
                "schotty1",
                "password",
                "Heiko",
                "Schotte",
                AppUserRole.USER,
                LocalDate.of(1987, 1, 8),
                "schotty1@email.com",
                Gender.MALE);

        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .body(appUser)
                        .then()
                        .when()
                        .post("/api/v1/user/new")
                        .then()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_CREATED, response.getStatusCode());

        authSetup();
        String accessToken = env.get("access_token");
        response = given()
                .contentType(ContentType.JSON)
                .auth()
                .oauth2(accessToken)
                .body(appUser)
                .when()
                .delete("/api/v1/user/" + appUser.getUsername())
                .then()
                .extract().response();
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
    }

    @Test
    public void shouldFailOnCreateUserWithInvalidPayloadFormat() throws JSONException {

        //given valid payload
        JSONObject jsonObject = new JSONObject()
                .put("firstName", "Heiko")
                .put("lastName", "Schotte")
                .put("password", "password")
                .put("email", "schotty2@email.com")
                .put("dob", "1987-01-08")
                .put("gender", "MALE")
                .put("username", "schotty2");
        log.info(jsonObject.toString());

        //fail on giving wrong Content-Type header
        Response response =
                given()
                        .contentType(ContentType.TEXT)
                        .body(jsonObject.toString())
                        .when()
                        .post("/api/v1/user/new")
                        .then()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_UNSUPPORTED_TYPE, response.getStatusCode());

        response =
                given()
                        .body(jsonObject.toString())
                        .when()
                        .post("/api/v1/user/new")
                        .then()
                        .extract().response();
        Assertions.assertEquals(HTTP_UNSUPPORTED_TYPE, response.getStatusCode());
    }

    @Test
    public void shouldFailOnCreateExistingUser() {
        AppUser appUser = new AppUser(
                "schotty3",
                "password",
                "Heiko",
                "Schotte",
                AppUserRole.USER,
                LocalDate.of(1987, 1, 8),
                "schotty3@email.com",
                Gender.MALE);

        //creating user successfully
        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .body(appUser)
                        .when()
                        .post("/api/v1/user/new")
                        .then()
                        .extract().response();

        log.info("Created : " + response.getStatusCode());
        Assertions.assertEquals(HTTP_CREATED, response.getStatusCode());

        //fail on recreating the same user
        response = given()
                .contentType(ContentType.JSON)
                .body(appUser)
                .when()
                .post("/api/v1/user/new")
                .then()
                .extract().response();

        Assertions.assertEquals(HTTP_CONFLICT, response.getStatusCode());

        authSetup();
        String accessToken = env.get("access_token");
        response = given()
                .contentType(ContentType.JSON)
                .auth()
                .oauth2(accessToken)
                .body(appUser)
                .when()
                .delete("/api/v1/user/" + appUser.getUsername())
                .then()
                .extract().response();
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());

    }
}
