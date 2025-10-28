package com.sportify.controller;

import com.sportify.entity.User;
import com.sportify.model.EmailRequest;
import com.sportify.model.LoginRequest;
import com.sportify.model.LoginResponse;
import com.sportify.model.MessageResponse;
import com.sportify.model.OtpVerificationRequest;
import com.sportify.model.SignupRequest;
import com.sportify.repository.UserRepository;
import com.sportify.service.AuthService;
import com.sportify.service.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {
    
    private static final Logger log = LoggerFactory.getLogger(AuthController.class);
    
    @Autowired
    private AuthService authService;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JwtUtil jwtUtil;
    
    // Signup
    @PostMapping("/signup")
    public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
        try {
            authService.signup(request);
            return ResponseEntity.ok(new MessageResponse(
                "Signup successful! OTP sent to " + request.getEmail()
            ));
        } catch (Exception e) {
            log.error("Signup error: " + e.getMessage());
            return ResponseEntity.badRequest()
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Verify Signup OTP
    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody OtpVerificationRequest request) {
        try {
            authService.verifyOtp(request.getEmail(), request.getOtpCode());
            return ResponseEntity.ok(new MessageResponse("Email verified! You can now login."));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    // ===== SIGN IN FLOW =====
    
    // Step 1: Request OTP for sign in
    @PostMapping("/signin/request-otp")
    public ResponseEntity<?> requestSignInOtp(@RequestBody EmailRequest request) {
        try {
            authService.requestSignInOtp(request.getEmail());
            return ResponseEntity.ok(new MessageResponse(
                "OTP sent to " + request.getEmail()
            ));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Step 2: Verify OTP and Login
    @PostMapping("/signin/verify-otp")
    public ResponseEntity<?> verifySignInOtp(@RequestBody OtpVerificationRequest request) {
        try {
            authService.verifySignInOtp(request.getEmail(), request.getOtpCode());
            
            // Generate JWT token after OTP verification
            User user = userRepository.findByEmail(request.getEmail()).orElseThrow();
            String token = jwtUtil.generateToken(user.getEmail());
            
            LoginResponse response = new LoginResponse();
            response.setToken(token);
            response.setUserId(user.getId());
            response.setEmail(user.getEmail());
            response.setName(user.getName());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse(e.getMessage()));
        }
    }
    
    // Traditional login (optional)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        try {
            LoginResponse response = authService.login(request);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse(e.getMessage()));
        }
    }
}