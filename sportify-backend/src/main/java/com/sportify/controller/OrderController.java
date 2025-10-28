package com.sportify.controller;

import com.sportify.entity.Order;
import com.sportify.model.MessageResponse;
import com.sportify.model.OrderRequest;
import com.sportify.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping("/create")
    public ResponseEntity<?> createOrder(@RequestHeader("Authorization") String token,
                                         @RequestBody OrderRequest request) {
        try {
            Order order = orderService.createOrder(token, request);
            return ResponseEntity.ok(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
    
    @GetMapping("/my-orders")
    public ResponseEntity<?> getMyOrders(@RequestHeader("Authorization") String token) {
        try {
            List<Order> orders = orderService.getUserOrders(token);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}