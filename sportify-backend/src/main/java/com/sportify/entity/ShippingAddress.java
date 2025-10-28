package com.sportify.entity;

import jakarta.persistence.Embeddable;
import lombok.Data;

@Embeddable
@Data
public class ShippingAddress {
    private String fullName;
    private String addressLine1;
    private String addressLine2;
    private String city;
    private String state;
    private String pinCode;
    private String phone;
}