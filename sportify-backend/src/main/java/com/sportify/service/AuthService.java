package com.sportify.service;

import com.sportify.entity.User;
import com.sportify.model.LoginRequest;
import com.sportify.model.LoginResponse;
import com.sportify.model.SignupRequest;
import com.sportify.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtUtil jwtUtil;

    public void signup(SignupRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setVerificationToken(UUID.randomUUID().toString());

        userRepository.save(user);

        emailService.sendVerificationEmail(user.getEmail(), user.getVerificationToken());
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid credentials");
        }

        if (!user.isEmailVerified()) {
            throw new RuntimeException("Email not verified");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setMessage("Login successful");

        return response;
    }

    public void verifyEmail(String token) {
        User user = userRepository.findByVerificationToken(token)
                .orElseThrow(() -> new RuntimeException("Invalid token"));

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        userRepository.save(user);
    }
}