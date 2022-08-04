package com.elte.wgl13q_thesis.server.service;

import com.elte.wgl13q_thesis.server.model.AppUser;
import com.elte.wgl13q_thesis.server.model.AppUserRole;
import com.elte.wgl13q_thesis.server.model.Role;

import java.util.List;

public interface UserService {
    void addNewUser(AppUser user);

    AppUserRole saveRole(AppUserRole role);

    void addRoleToUser(String username, String roleName);

    AppUser getUser(String username);

    List<AppUser> getUsers();

}
