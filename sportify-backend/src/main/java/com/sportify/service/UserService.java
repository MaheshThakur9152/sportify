package com.sportify.service;

import com.sportify.entity.User;
import com.sportify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    public User getUserProfile(String token) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public void updateProfile(String token, String name, String phone) {
        String email = jwtUtil.extractEmail(token.replace("Bearer ", ""));
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (name != null) user.setName(name);
        if (phone != null) user.setPhone(phone);

        userRepository.save(user);
    }
}