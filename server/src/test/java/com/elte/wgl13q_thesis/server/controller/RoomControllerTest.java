package com.elte.wgl13q_thesis.server.controller;

import com.elte.wgl13q_thesis.server.model.Language;
import com.elte.wgl13q_thesis.server.model.ProficiencyLevel;
import com.elte.wgl13q_thesis.server.model.RoomRequestBody;
import io.restassured.RestAssured;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.AfterAll;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.Objects;
import java.util.Properties;

import static io.restassured.RestAssured.given;
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
    @AfterAll
    public static void clearRooms(){
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/all")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
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

    public static void createRoom(String uuId, Language language, ProficiencyLevel level) {
        String roomId = "9";
        RoomRequestBody roomRequestBody = new RoomRequestBody(roomId, uuId, level, language);
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .body(roomRequestBody)
                        .and()
                        .auth()
                        .oauth2(accessToken)
                        .post("/api/v1/room/new")
                        .then()
                        .extract().response();
        Assertions.assertEquals(HTTP_CREATED, response.getStatusCode());
    }

    @Test
    public void shouldCreateRoomTest() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        String roomId = "1";
        String uuId = "ac309a95-2ae5-450d-bfbd-24f1be34531y";
        ProficiencyLevel proficiencyLevel = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        RoomRequestBody roomRequestBody = new RoomRequestBody(roomId, uuId, proficiencyLevel, language);
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
    public void shouldFailOnCreateRoomTestWithInvalidToken() {
        String roomId = "1";
        String uuId = "ac309a95-2ae5-450d-bfbd-24f1be34531y";
        ProficiencyLevel proficiencyLevel = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        RoomRequestBody roomRequestBody = new RoomRequestBody(roomId, uuId, proficiencyLevel, language);
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
    public void shouldFailOnCreateRoomTestWithEmptyBody() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
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
    public void shouldFailOnCreateRoomTestWithInvalidLanguage() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        String roomId = "1";
        String uuId = "ac309a95-2ae5-450d-bfbd-24f1be34531y";
        ProficiencyLevel proficiencyLevel = ProficiencyLevel.NATIVE;
        RoomRequestBody roomRequestBody = new RoomRequestBody(roomId, uuId, proficiencyLevel, null);
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
        Assertions.assertEquals(HTTP_BAD_REQUEST, response.getStatusCode());
    }


    @Test
    public void shouldFailOnCreateRoomTestWithInvalidLevel() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        String roomId = "1";
        String uuId = "ac309a95-2ae5-450d-bfbd-24f1be34531y";
        Language language = Language.GERMAN;

        RoomRequestBody roomRequestBody = new RoomRequestBody(roomId, uuId, null, language);
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
        Assertions.assertEquals(HTTP_BAD_REQUEST, response.getStatusCode());
    }


    @Test
    public void shouldFailOnGetRoomWithIdWithNoToken() {
        String id = "1";
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .get("/api/v1/room/" + id)
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldFailOnGetRoomWithIdWithInvalidToken() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");

        accessToken = accessToken.substring(0, accessToken.length() / 2);

        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .auth()
                .oauth2(accessToken)
                .get("/api/v1/room/1")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }
    @Test
    public void shouldFailOnGetRoomWithInvalidId() {

        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);

        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .auth()
                .oauth2(accessToken)
                .get("/api/v1/room/-1")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_NOT_FOUND, response.getStatusCode());
    }
    @Test
    public void shouldGetRoomWithId() {
        createRoom("ac309a95-2ae5-450d-bfbd-24f1be34531y", Language.GERMAN, ProficiencyLevel.NATIVE);
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String id = "1";
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .auth()
                .oauth2(accessToken)
                .get("/api/v1/room/" + id)
                .then()
                .extract()
                .response();
        log.info(String.valueOf(response.getStatusCode()));
        String roomNumber = response.jsonPath().getString("roomNumber");
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
        Assertions.assertEquals(id, roomNumber);
    }

    @Test
    public void shouldGetRoomWithIdWithWrongMethod() {
        createRoom("ac309a95-2ae5-450d-bfbd-24f1be34531y", Language.GERMAN, ProficiencyLevel.NATIVE);
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String id = "1";
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .auth()
                .oauth2(accessToken)
                .post("/api/v1/room/" + id)
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_BAD_METHOD, response.getStatusCode());
    }

    @Test
    public void shouldGetAllRooms() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
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
    public void shouldFailOnGetAllRoomsWithInvalidToken() {
        Response response = RestAssured
                .given()
                .get("/api/v1/room/all")
                .then()
                .extract()
                .response();
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldDeleteAllRooms() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/all")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
    }

    @Test
    public void shouldFailOndDeleteAllRoomsWithNoToken() {
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .delete("/api/v1/room/all")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldFailOnDeleteAllRoomsWithInvalidToken() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        accessToken = accessToken.substring(0, accessToken.length() / 2);
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/all")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldFailOnDeleteAllRoomsWithExpiredToken() {

        String accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbm5hc21pdGgiLCJyb2xlcyI6WyJBRE1JTiJdLCJpc3MiOiJodHRwczovLzE5Mi4xNjguMC4yMTg6ODA4MC9sb2dp";
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/all")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }
    @Test
    public void shouldDeleteRoom() {
        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");
        String roomId = "1";
        ProficiencyLevel proficiencyLevel = ProficiencyLevel.NATIVE;
        Language language = Language.GERMAN;
        createRoom(roomId,language,proficiencyLevel);
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/"+roomId)
                .then()
                .extract()
                .response();

        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
        response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .get("/api/v1/room/"+roomId)
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_NOT_FOUND, response.getStatusCode());
    }
    @Test
    public void shouldFailOnDeleteRoomWithInvalidToken() {
        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");
        accessToken = accessToken.substring(0,accessToken.length()/2);

        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/"+1)
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }
    @Test
    public void shouldFailOnDeleteRoomWithNoToken() {
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .delete("/api/v1/room/"+1)
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }
    @Test
    public void shouldFailOnDeleteRoomWithInvalidNumber() {
        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/"+"-1")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_NOT_FOUND, response.getStatusCode());
    }
    @Test
    public void shouldFailOnDeleteRoomWithInvalidAccess() {
        authSetupWithCredentials(AUTH_USER_USERNAME, AUTH_USER_SECRET);
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/"+"-1")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }
    @Test
    public void shouldFailOnDeleteRoomWithExpiredToken() {

        String accessToken = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJhbm5hc21pdGgiLCJyb2xlcyI6WyJBRE1JTiJdLCJpc3MiOiJodHRwczovLzE5Mi4xNjguMC4yMTg6ODA4MC9sb2dp";
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .delete("/api/v1/room/"+"-1")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldReturnForbiddenOnUnknownPathForRoomWithNoAuth() {

        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .get("/api/v1/room/")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldReturnNotFoundOnUnknownPathForRoom() {
        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .get("/api/v1/room/")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void shouldReturnNotFoundOnWrongAPIVersion() {
        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");
        Response response = RestAssured
                .given()
                .contentType(ContentType.JSON)
                .and()
                .auth()
                .oauth2(accessToken)
                .get("/api/v2/room/")
                .then()
                .extract()
                .response();
        Assertions.assertEquals(HTTP_NOT_FOUND, response.getStatusCode());
    }


}
