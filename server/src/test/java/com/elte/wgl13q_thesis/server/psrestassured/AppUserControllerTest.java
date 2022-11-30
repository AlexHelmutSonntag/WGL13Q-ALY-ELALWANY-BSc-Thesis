package com.elte.wgl13q_thesis.server.psrestassured;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.model.Gender;
import io.restassured.http.ContentType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import lombok.extern.slf4j.Slf4j;
import org.hamcrest.Matcher;
import org.json.JSONException;
import org.json.JSONObject;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import io.restassured.RestAssured;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
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

    public static void createTestUser(String username, String password, String firstName, String lastName, AppUserRole role, String email, Gender gender, LocalDate localDate) {
        AppUser appUser = new AppUser(
                username,
                password,
                firstName,
                lastName,
                role,
                localDate,
                email,
                gender);
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
    }

    public static void removeUser(String username) {
//        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");
        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .then()
                        .when()
                        .delete("/api/v1/user/" + username)
                        .then()
                        .extract().response();
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
    }

    @Test
    public void shouldLogin() {
        Response response = RestAssured
                .given()
                .header("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
                .formParam("username", AUTH_USER_USERNAME)
                .formParam("password", AUTH_USER_SECRET)
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
                .formParam("username", AUTH_USER_USERNAME)
                .formParam("password", "wrong_password")
                .post("login");

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldUserGetAllUsers() throws IOException {
        String username = "test_user";
        String password = "test_user_password";
        String firstName = "Test";
        String lastName = "User";
        String email = "test_user@email.com";
        AppUserRole role = AppUserRole.USER;
        LocalDate dob = LocalDate.of(1969, 1, 8);
        Gender gender = Gender.MALE;
        createTestUser(username,
                password,
                firstName,
                lastName,
                role,
                email,
                gender,
                dob);
        authSetupWithCredentials(username, password);
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

        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        removeUser(username);
    }

    @Test
    public void shouldGetAllUsersAsAdmin() throws IOException {

        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
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
    public void shouldCreateUserAndCheckForUserData() {
        String username = "test_user";
        String password = "test_user_password";
        String firstName = "Test";
        String lastName = "User";
        String email = "test_user@email.com";
        AppUserRole role = AppUserRole.USER;
        LocalDate dob = LocalDate.of(1999, 1, 8);
        Gender gender = Gender.MALE;

        createTestUser(username,
                password,
                firstName,
                lastName,
                role,
                email,
                gender,
                dob);

        authSetupWithCredentials(username, password);
        String accessToken = env.get("access_token");

        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .then()
                        .when()
                        .get("/api/v1/user/" + username)
                        .then()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());

        String fetchedUsername = response.jsonPath().get("username");
        String fetchedFirstName = response.jsonPath().get("firstName");
        String fetchedLastName = response.jsonPath().get("lastName");
        String fetchedRole = response.jsonPath().get("role");
        String fetchedGender = response.jsonPath().get("gender");
        String fetchedEmail = response.jsonPath().get("email");
        String fetchedName = response.jsonPath().get("name");
        Assertions.assertEquals(username, fetchedUsername);
        Assertions.assertEquals(firstName, fetchedFirstName);
        Assertions.assertEquals(lastName, fetchedLastName);
        Assertions.assertEquals(email, fetchedEmail);
        Assertions.assertEquals(role.toString(), fetchedRole);
        Assertions.assertEquals(gender.toString(), fetchedGender);
        Assertions.assertEquals(firstName + " " + lastName, fetchedName);

        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        removeUser(username);

    }

    @Test
    public void shouldCreateNewUser() {
        AppUser appUser = new AppUser(
                "schotty1",
                "password",
                "Heiko",
                "Schotte",
                AppUserRole.USER,
                LocalDate.of(1989, 1, 8),
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

        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
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
                .put("dob", "1990-01-08")
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
    public void shouldFailOnCreateExistingUserWithConflict() {
        AppUser appUser = new AppUser(
                "test_user",
                "password",
                "Test",
                "User",
                AppUserRole.USER,
                LocalDate.of(1991, 1, 8),
                "test_user@email.com",
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

        //cleanup
        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        removeUser(appUser.getUsername());
    }

    @Test
    public void shouldCreateAndDeleteUser() {
        String username = "test_user";
        String password = "test_user_password";
        AppUser appUser = new AppUser(
                username,
                password,
                "Test",
                "User",
                AppUserRole.USER,
                LocalDate.of(1992, 1, 8),
                "test_user@email.com",
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
        authSetupWithCredentials(username, password);
        String accessToken = env.get("access_token");
        response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .then()
                        .when()
                        .delete("/api/v1/user/" + username)
                        .then()
                        .extract().response();
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
    }

    @Test
    public void shouldFailOnDeleteUserWithBadMethod() {
        String username = "test_user";
        String password = "test_user_password";
        String firstName = "Test";
        String lastName = "User";
        String email = "test_user@email.com";
        AppUserRole role = AppUserRole.USER;
        LocalDate dob = LocalDate.of(1993, 1, 8);
        Gender gender = Gender.MALE;

        createTestUser(username,
                password,
                firstName,
                lastName,
                role,
                email,
                gender,
                dob);

        String different_user_username = "different_user";
        String different_user_password = "different_user_password";
        String different_user_firstName = "Different";
        String different_user_lastName = "TestUser";
        String different_user_email = "different_test_user@email.com";
        AppUserRole different_user_role = AppUserRole.USER;
        LocalDate different_user_dob = LocalDate.of(1994, 1, 8);
        Gender different_user_gender = Gender.MALE;

        createTestUser(different_user_username,
                different_user_password,
                different_user_firstName,
                different_user_lastName,
                different_user_role,
                different_user_email,
                different_user_gender,
                different_user_dob);

        authSetupWithCredentials(different_user_username, different_user_password);
        String accessToken = env.get("access_token");
        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .then()
                        .when()
                        .delete("/api/v1/user/" + username)
                        .then()
                        .extract().response();
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());

        //Clean up
        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        removeUser(username);
        removeUser(different_user_username);
    }

    @Test
    public void shouldDeleteUserAsAdmin() {
        String username = "test_user";
        String password = "test_user_password";
        String firstName = "Test";
        String lastName = "User";
        String email = "test_user@email.com";
        AppUserRole userRole = AppUserRole.USER;
        Gender gender = Gender.MALE;
        LocalDate dob = LocalDate.of(1995, 1, 8);

        createTestUser(username, password, firstName, lastName, userRole, email, gender, dob);

        authSetupWithCredentials(username, password);
        String accessToken = env.get("access_token");
        log.info(accessToken);
        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .then()
                        .when()
                        .delete("/api/v1/user/" + username)
                        .then()
                        .extract().response();
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());
    }

    @Test
    public void shouldFailOnDeleteUserWithUserNotFoundAsAdmin() {
        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");
        String username = "non_existing_user";
        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .then()
                        .when()
                        .delete("/api/v1/user/" + username)
                        .then()
                        .extract().response();
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_NOT_FOUND, response.getStatusCode());
    }

    @Test
    public void shouldCreateUserThenDeleteItThenFailOnLogin() {
        String username = "test_user";
        String password = "test_user_password";
        String firstName = "Test";
        String lastName = "User";
        String email = "test_user@email.com";
        AppUserRole userRole = AppUserRole.USER;
        Gender gender = Gender.MALE;
        LocalDate dob = LocalDate.of(1995, 1, 8);

        createTestUser(username, password, firstName, lastName, userRole, email, gender, dob);

        RequestSpecification request =
                RestAssured.given()
                        .header("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
                        .formParam("username", username)
                        .formParam("password", password);

        Response response = request.post("login");
        Assertions.assertEquals(HTTP_OK, response.getStatusCode());

        env.put("access_token", response.jsonPath().get("access_token"));
        removeUser(username);

        request = RestAssured.
                given()
                .header("Content-type", "application/x-www-form-urlencoded; charset=utf-8")
                .formParam("username", username)
                .formParam("password", password);
        response = request.post("login");

        Assertions.assertEquals(HTTP_FORBIDDEN, response.getStatusCode());
    }

    @Test
    public void shouldUpdateUser(){
        String username = "test_user";
        String password = "test_user_password";
        String firstName = "Test";
        String lastName = "User";
        String email = "test_user@email.com";
        AppUserRole role = AppUserRole.USER;
        Gender gender = Gender.MALE;
        LocalDate dob = LocalDate.of(1995, 1, 8);

        createTestUser(username, password, firstName, lastName, role, email, gender, dob);

        authSetupWithCredentials(username,password);
        String accessToken = env.get("access_token");

        firstName = "new_firstName";
        lastName = "new_lastName";
        password = "new_password";
        email = "new_email";
        gender = Gender.FEMALE;
        dob = LocalDate.of(1999, 1, 8);

        AppUser appUser = new AppUser(
                username,
                password,
                firstName,
                lastName,
                role,
                dob,
                email,
                gender);

        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .body(appUser)
                        .when()
                        .put("/api/v1/user/updateUser/"+username)
                        .then()
                        .log().body()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_OK,response.getStatusCode());

        String fetchedFirstName = response.jsonPath().get("firstName");
        String fetchedLastName = response.jsonPath().get("lastName");
        String fetchedEmail = response.jsonPath().get("email");
        String fetchedRole  = response.jsonPath().get("role");
        String fetchedGender  = response.jsonPath().get("gender");
        String fetchedDob  = response.jsonPath().get("dob");

        Assertions.assertEquals(firstName,fetchedFirstName);
        Assertions.assertEquals(lastName,fetchedLastName);
        Assertions.assertEquals(email,fetchedEmail);
        Assertions.assertEquals(role,AppUserRole.valueOf(fetchedRole));
        Assertions.assertEquals(dob.toString(),fetchedDob);
        Assertions.assertEquals(gender,Gender.valueOf(fetchedGender));

        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        removeUser(username);
    }
    @Test
    public void shouldUpdateUserAsAdmin() {
        String username = "test_user";
        String password = "test_user_password";
        String firstName = "Test";
        String lastName = "User";
        String email = "test_user@email.com";
        AppUserRole role = AppUserRole.USER;
        Gender gender = Gender.MALE;
        LocalDate dob = LocalDate.of(1995, 1, 8);

        createTestUser(username, password, firstName, lastName, role, email, gender, dob);

        firstName = "new_firstName";
        lastName = "new_lastName";
        password = "new_password";
        email = "new_email";
        gender = Gender.FEMALE;
        dob = LocalDate.of(1999, 1, 8);

        AppUser appUser = new AppUser(
                username,
                password,
                firstName,
                lastName,
                role,
                dob,
                email,
                gender);

        authSetupWithCredentials(AUTH_ADMIN_USERNAME,AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");

        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .body(appUser)
                        .when()
                        .put("/api/v1/user/updateUser/"+username)
                        .then()
                        .log().body()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_OK,response.getStatusCode());

        String fetchedFirstName = response.jsonPath().get("firstName");
        String fetchedLastName = response.jsonPath().get("lastName");
        String fetchedEmail = response.jsonPath().get("email");
        String fetchedRole  = response.jsonPath().get("role");
        String fetchedGender  = response.jsonPath().get("gender");
        String fetchedDob  = response.jsonPath().get("dob");

        Assertions.assertEquals(firstName,fetchedFirstName);
        Assertions.assertEquals(lastName,fetchedLastName);
        Assertions.assertEquals(email,fetchedEmail);
        Assertions.assertEquals(role,AppUserRole.valueOf(fetchedRole));
        Assertions.assertEquals(dob.toString(),fetchedDob);
        Assertions.assertEquals(gender,Gender.valueOf(fetchedGender));

        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        removeUser(username);
    }

    @Test
    public void shouldFailOnUpdatingUserWithForbidden(){
        //Create user
        String username = "test_user";
        String password = "test_user_password";
        String firstName = "Test";
        String lastName = "User";
        String email = "test_user@email.com";
        AppUserRole role = AppUserRole.USER;
        Gender gender = Gender.MALE;
        LocalDate dob = LocalDate.of(1995, 1, 8);

        createTestUser(username, password, firstName, lastName, role, email, gender, dob);

        //User new data
        AppUser appUser = new AppUser(
                "different_username",
                "different_password",
                "different_firstname",
                "different_lastname",
                role,
                LocalDate.of(1999,12,31),
                "different@email.com",
                Gender.FEMALE);

        //Another user
        String max_username = "max";
        String max_password = "max_password";
        String max_firstName = "Max";
        String max_lastName = "Payne";
        AppUserRole max_role = AppUserRole.USER;
        String max_email = "max@email.com";
        Gender max_gender = Gender.MALE;
        LocalDate max_dob = LocalDate.of(1994, 1, 8);

        createTestUser(max_username, max_password, max_firstName, max_lastName, max_role, max_email, max_gender, max_dob);

        authSetupWithCredentials(max_username,max_password);
        String accessToken = env.get("access_token");

        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .body(appUser)
                        .when()
                        .put("/api/v1/user/updateUser/"+username)
                        .then()
                        .log().body()
                        .extract().response();

        //Unauthorized user
        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_FORBIDDEN,response.getStatusCode());

        authSetupWithCredentials(AUTH_ADMIN_USERNAME, AUTH_ADMIN_SECRET);
        removeUser(username);
        removeUser(max_username);
    }

    @Test
    public void shouldFailOnUpdatingNonExistingUser(){
        AppUser appUser = new AppUser(
                "different_username",
                "different_password",
                "different_firstname",
                "different_lastname",
                AppUserRole.USER,
                LocalDate.of(1999,12,31),
                "different@email.com",
                Gender.FEMALE);

        authSetupWithCredentials(AUTH_ADMIN_USERNAME,AUTH_ADMIN_SECRET);
        String accessToken = env.get("access_token");
        Response response =
                given()
                        .contentType(ContentType.JSON)
                        .auth()
                        .oauth2(accessToken)
                        .body(appUser)
                        .when()
                        .put("/api/v1/user/updateUser/"+appUser.getUsername())
                        .then()
                        .log().body()
                        .extract().response();

        log.info(String.valueOf(response.getStatusCode()));
        Assertions.assertEquals(HTTP_NOT_FOUND,response.getStatusCode());

    }





}
