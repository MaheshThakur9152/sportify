package com.sportify.controller;

import com.sportify.entity.CartItem;
import com.sportify.model.CartRequest;
import com.sportify.model.MessageResponse;
import com.sportify.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartService cartService;

    @PostMapping("/add")
    public ResponseEntity<?> addToCart(@RequestHeader("Authorization") String token,
                                       @RequestBody CartRequest request) {
        try {
            cartService.addToCart(token, request);
            return ResponseEntity.ok(new MessageResponse("Added to cart"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @GetMapping
    public ResponseEntity<?> getCart(@RequestHeader("Authorization") String token) {
        try {
            List<CartItem> cart = cartService.getCart(token);
            return ResponseEntity.ok(cart);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(@RequestHeader("Authorization") String token) {
        try {
            cartService.clearCart(token);
            return ResponseEntity.ok(new MessageResponse("Cart cleared"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse(e.getMessage()));
        }
    }
}