package com.elte.wgl13q_thesis.server.model;

import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import java.util.Set;


import com.google.common.collect.Sets;

public enum Role {
    USER(Sets.newHashSet(AppUserPermission.USER_READ, AppUserPermission.USER_WRITE)),
    ADMIN(Sets.newHashSet(AppUserPermission.ADMIN_READ, AppUserPermission.ADMIN_WRITE, AppUserPermission.USER_READ, AppUserPermission.USER_WRITE));

    private final Set<AppUserPermission> permissions;

    Role(Set<AppUserPermission> permissions) {
        this.permissions = permissions;
    }

    public Set<AppUserPermission> getPermissions() {
        return permissions;
    }
}
