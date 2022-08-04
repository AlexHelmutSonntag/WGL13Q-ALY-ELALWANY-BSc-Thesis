package com.elte.wgl13q_thesis.server.repo;

import com.elte.wgl13q_thesis.server.model.AppUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AppUserRepository extends JpaRepository<AppUser, Long> {

    @Query("SELECT u FROM AppUser u WHERE u.email = ?1")
    Optional<AppUser> findUserByEmail(String string);

    @Query("SELECT u FROM AppUser u WHERE u.username = ?1")
    AppUser findUserByUsername(String username);


}
