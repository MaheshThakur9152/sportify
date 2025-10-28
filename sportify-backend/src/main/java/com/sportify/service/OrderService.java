package com.sportify.service;

import com.sportify.entity.Order;
import com.sportify.entity.OrderItem;
import com.sportify.entity.User;
import com.sportify.model.OrderRequest;
import com.sportify.repository.OrderRepository;
import com.sportify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public Order createOrder(String token, OrderRequest request) {
        String email = jwtUtil.extractEmail(token.substring(7)); // Remove "Bearer "
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Order order = new Order();
        order.setUser(user);
        order.setOrderNumber("SP" + System.currentTimeMillis());
        order.setTotalAmount(request.getTotalAmount());
        order.setShippingName(request.getShippingAddress().getFullName());
        order.setShippingAddress(request.getShippingAddress().getAddressLine1() + (request.getShippingAddress().getAddressLine2() != null ? ", " + request.getShippingAddress().getAddressLine2() : ""));
        order.setShippingCity(request.getShippingAddress().getCity());
        order.setShippingState(request.getShippingAddress().getState());
        order.setShippingPin(request.getShippingAddress().getPinCode());
        order.setShippingPhone(request.getShippingAddress().getPhone());
        order.setCreatedAt(LocalDateTime.now());

        for (OrderItem item : request.getItems()) {
            item.setOrder(order);
        }
        order.setItems(request.getItems());

        return orderRepository.save(order);
    }

    public List<Order> getUserOrders(String token) {
        String email = jwtUtil.extractEmail(token.substring(7));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return orderRepository.findByUserOrderByCreatedAtDesc(user);
    }
}