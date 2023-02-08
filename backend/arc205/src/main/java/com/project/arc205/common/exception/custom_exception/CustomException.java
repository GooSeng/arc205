package com.project.arc205.common.exception.custom_exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public abstract class CustomException extends RuntimeException {
    private final HttpStatus status;
    public CustomException(HttpStatus status, String message) {
        super(message);
        this.status = status;
    }
}
