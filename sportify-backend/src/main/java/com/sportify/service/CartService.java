package com.sportify.service;

import com.sportify.entity.CartItem;
import com.sportify.entity.User;
import com.sportify.model.CartRequest;
import com.sportify.repository.CartRepository;
import com.sportify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CartService {

    @Autowired
    private CartRepository cartRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public void addToCart(String token, CartRequest request) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        CartItem cartItem = new CartItem();
        cartItem.setUser(user);
        cartItem.setProductId(request.getProductId());
        cartItem.setProductName(request.getProductName());
        cartItem.setProductImage(request.getProductImage());
        cartItem.setPrice(request.getPrice());
        cartItem.setQuantity(request.getQuantity());
        cartItem.setSize(request.getSize());

        cartRepository.save(cartItem);
    }

    public List<CartItem> getCart(String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return cartRepository.findByUser(user);
    }

    public void clearCart(String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        cartRepository.deleteByUser(user);
    }
}