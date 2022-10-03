package com.elte.wgl13q_thesis.server.util;

import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@Slf4j
public class Parser {

    public Optional<Long> parseId(String sid) {
        Long id = null;
        try {
            id = Long.valueOf(sid);
        } catch (Exception e) {
            log.debug("An error occurred: {}", e.getMessage());
        }
        return Optional.ofNullable(id);
    }
}
