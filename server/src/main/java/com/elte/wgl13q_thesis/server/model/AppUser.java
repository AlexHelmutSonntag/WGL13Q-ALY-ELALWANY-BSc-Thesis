package com.elte.wgl13q_thesis.server.model;

import javax.persistence.*;
import java.time.LocalDate;
import java.time.Period;

@Entity
@Table
public class AppUser {

    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_sequence")

    private Long id;
    private String username;
    @Column(columnDefinition = "varchar(60)")
    private String password;
    private String firstName;
    private String lastName;
    private AppUserRole role;
    private LocalDate dob;

    private Gender gender;
    private String email;
    @Transient // This field won't be a column in our database
    private Integer age;

    public AppUser() {

    }

    public AppUser(String username, String password, String firstName, String lastName, AppUserRole role, LocalDate dob, String email, Gender gender) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.dob = dob;
        this.email = email;
        this.gender = gender;
    }
    public AppUser(String password, String firstName, String lastName, AppUserRole role, LocalDate dob, String email) {
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.dob = dob;
        this.email = email;
        this.gender = Gender.OTHER;
    }
    public AppUser(String username, String password, String firstName, String lastName, AppUserRole role, LocalDate dob, String email) {
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.dob = dob;
        this.email = email;
        this.gender = Gender.OTHER;
    }

    public AppUser(Long id, String username, String password, String firstName, String lastName, AppUserRole role, LocalDate dob, String email) {
        this.id = id;
        this.username = username;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
        this.dob = dob;
        this.email = email;
        this.gender = Gender.OTHER;
    }

    public Gender getGender() {
        return gender;
    }

    public void setGender(Gender gender) {
        this.gender = gender;
    }

    public AppUserRole getRole() {
        return role;
    }

    public void setRole(AppUserRole role) {
        this.role = role;
    }

    public String getPassword() {
        return password;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public String getName() {
        return firstName + ' ' + lastName;
    }

    public LocalDate getDob() {
        return dob;
    }

    public String getEmail() {
        return email;
    }

    public Integer getAge() {
        return Period.between(this.dob, LocalDate.now()).getYears();
    }

    @Override
    public String toString() {
        return "AppUser{" +
                "id=" + id +
                ", username='" + username + '\'' +
                ", firstName='" + firstName + '\'' +
                ", lastName='" + lastName + '\'' +
                ", dob=" + dob +
                ", email='" + email + '\'' +
                ", age=" + age +
                '}';
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setDob(LocalDate dob) {
        this.dob = dob;
    }
}
