package com.sportify.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class MessageResponse {
    @JsonProperty("message")
    private String message;

    public MessageResponse(String message) {
        this.message = message;
    }
}