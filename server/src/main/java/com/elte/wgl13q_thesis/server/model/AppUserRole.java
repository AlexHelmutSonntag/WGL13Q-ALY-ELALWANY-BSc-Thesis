package com.elte.wgl13q_thesis.server.model;


import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

import static javax.persistence.GenerationType.AUTO;


//@Entity
//@Table
public enum AppUserRole {

    USER,
    ADMIN;
    //TODO make ManyToOne relation between AppUserRole and AppUser
//    @Id
//    @SequenceGenerator(
//            name = "role_sequence",
//            sequenceName = "role_sequence",
//            allocationSize = 1
//    )
//    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "role_sequence")
//
//    private Long id;
//
//    private AppUser appUser;
//
//    @ManyToOne
//    @JoinColumn(name = "app_user_id", nullable = false)
//    public AppUser getAppUser() {
//        return appUser;
//    }
}
