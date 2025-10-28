package com.sportify.service;

import com.sportify.entity.User;
import com.sportify.model.LoginRequest;
import com.sportify.model.LoginResponse;
import com.sportify.model.SignupRequest;
import com.sportify.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Random;

@Service
public class AuthService {
    
    private static final Logger log = LoggerFactory.getLogger(AuthService.class);
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private SendGridEmailService emailService;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private JwtUtil jwtTokenProvider;
    
    // ===== SIGN UP FLOW =====
    public void signup(SignupRequest request) throws Exception {
        log.info("=== SIGNUP STARTED ===");
        
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new Exception("Email already registered");
        }
        
        String otpCode = generateOtpCode();
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setPhone(request.getPhone());
        user.setOtpCode(otpCode);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        user.setEmailVerified(false);
        
        userRepository.save(user);
        log.info("User created. OTP: " + otpCode);
        
        emailService.sendOtpEmail(request.getEmail(), otpCode, user.getName());
        log.info("=== SIGNUP COMPLETED ===");
    }
    
    // ===== SIGN IN FLOW - STEP 1: Send OTP =====
    public void requestSignInOtp(String email) throws Exception {
        log.info("=== SIGN IN - REQUEST OTP ===");
        log.info("Email: " + email);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new Exception("User not found"));
        
        String otpCode = generateOtpCode();
        user.setOtpCode(otpCode);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(10));
        userRepository.save(user);
        
        log.info("Generated OTP: " + otpCode);
        emailService.sendOtpEmail(email, otpCode, user.getName());
        log.info("=== OTP SENT ===");
    }
    
    // ===== SIGN IN FLOW - STEP 2: Verify OTP =====
    public void verifySignInOtp(String email, String otpCode) throws Exception {
        log.info("=== SIGN IN - VERIFY OTP ===");
        log.info("Email: " + email);
        log.info("OTP: " + otpCode);
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new Exception("User not found"));
        
        if (user.getOtpCode() == null) {
            throw new Exception("No OTP found. Request new one.");
        }
        
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new Exception("OTP expired. Request new one.");
        }
        
        if (!user.getOtpCode().equals(otpCode)) {
            throw new Exception("Invalid OTP. Try again.");
        }
        
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setEmailVerified(true);
        userRepository.save(user);
        
        log.info("=== OTP VERIFIED SUCCESSFULLY ===");
    }
    
    // ===== TRADITIONAL LOGIN (Optional) =====
    public LoginResponse login(LoginRequest request) throws Exception {
        log.info("=== TRADITIONAL LOGIN ===");
        
        User user = userRepository.findByEmail(request.getEmail())
            .orElseThrow(() -> new Exception("User not found"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new Exception("Invalid password");
        }
        
        if (!user.isEmailVerified()) {
            throw new Exception("Email not verified. Please verify first.");
        }
        
        String token = jwtTokenProvider.generateToken(user.getEmail());
        
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        response.setUserId(user.getId());
        response.setEmail(user.getEmail());
        response.setName(user.getName());
        
        log.info("=== LOGIN SUCCESSFUL ===");
        return response;
    }
    
    // ===== VERIFY SIGNUP OTP =====
    public void verifyOtp(String email, String otpCode) throws Exception {
        log.info("=== VERIFY SIGNUP OTP ===");
        
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new Exception("User not found"));
        
        if (user.getOtpCode() == null) {
            throw new Exception("No OTP found. Request new one.");
        }
        
        if (user.getOtpExpiry().isBefore(LocalDateTime.now())) {
            throw new Exception("OTP expired. Request new one.");
        }
        
        if (!user.getOtpCode().equals(otpCode)) {
            throw new Exception("Invalid OTP. Try again.");
        }
        
        user.setOtpCode(null);
        user.setOtpExpiry(null);
        user.setEmailVerified(true);
        userRepository.save(user);
        
        log.info("=== SIGNUP OTP VERIFIED SUCCESSFULLY ===");
    }
    
    // ===== HELPER METHODS =====
    private String generateOtpCode() {
        Random random = new Random();
        int otp = 1000 + random.nextInt(9000);
        return String.valueOf(otp);
    }
}