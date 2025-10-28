package com.sportify.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "order_items")
@Data
public class OrderItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;
    
    private String productId;
    private String productName;
    private String productImage;
    private Double price;
    private Integer quantity;
    private String size;
    private String color;
}