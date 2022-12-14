package com.elte.wgl13q_thesis.server.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class Parser {

    public Optional<Integer> parseId(String sid) {
        Integer id = null;
        try {
            id = Integer.parseInt(sid);
        } catch (Exception e) {
            log.debug("An error occurred: {}", e.getMessage());
        }
        return Optional.ofNullable(id);
    }
}
