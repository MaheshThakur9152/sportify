package com.sportify.model;

import com.sportify.entity.OrderItem;
import com.sportify.entity.ShippingAddress;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {
    private ShippingAddress shippingAddress;
    private List<OrderItem> items;
    private Double totalAmount;
}