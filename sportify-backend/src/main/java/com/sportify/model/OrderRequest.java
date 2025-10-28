package com.sportify.model;

import com.sportify.entity.OrderItem;
import com.sportify.entity.ShippingAddress;

import java.util.List;

public class OrderRequest {
    private ShippingAddress shippingAddress;
    private List<OrderItem> items;
    private Double totalAmount;

    // Getters and Setters
    public ShippingAddress getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(ShippingAddress shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public List<OrderItem> getItems() {
        return items;
    }

    public void setItems(List<OrderItem> items) {
        this.items = items;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}