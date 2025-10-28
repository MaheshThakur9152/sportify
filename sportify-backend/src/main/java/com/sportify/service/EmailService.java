package com.sportify.service;

import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
// import org.springframework.stereotype.Service; // Removed since we're using SendGrid now

// @Service  // Commented out since we're using SendGrid now
public class EmailService {

    private static final Logger log = LoggerFactory.getLogger(EmailService.class);

    @Autowired
    private JavaMailSender mailSender;

    public void sendVerificationEmail(String toEmail, String verificationToken) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("devsportify7@gmail.com", "SPORTIFY");
            helper.setTo(toEmail);
            helper.setSubject("Verify Your SPORTIFY Account");

            String verificationUrl = "http://localhost:3000/verify?token=" + verificationToken;

            String htmlContent = "<html>" +
                "<body>" +
                "<h2>Welcome to SPORTIFY!</h2>" +
                "<p>Click the link below to verify your email address:</p>" +
                "<a href='" + verificationUrl + "' style='background-color: #000; color: white; padding: 10px 20px; text-decoration: none; border-radius: 4px;'>" +
                "Verify Email" +
                "</a>" +
                "<p>Or copy this link: " + verificationUrl + "</p>" +
                "<p>This link expires in 24 hours.</p>" +
                "</body>" +
                "</html>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent successfully to: " + toEmail);

        } catch (Exception e) {
            log.error("Failed to send verification email to " + toEmail + ": " + e.getMessage());
            throw new RuntimeException("Email service error: " + e.getMessage());
        }
    }

    public void sendWelcomeEmail(String toEmail, String userName) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom("devsportify7@gmail.com", "SPORTIFY");
            helper.setTo(toEmail);
            helper.setSubject("Welcome to SPORTIFY!");

            String htmlContent = "<html>" +
                "<body>" +
                "<h2>Welcome, " + userName + "!</h2>" +
                "<p>Your account has been successfully verified.</p>" +
                "<p>Start shopping now: <a href='http://localhost:3000/store'>SHOP NOW</a></p>" +
                "</body>" +
                "</html>";

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Welcome email sent to: " + toEmail);

        } catch (Exception e) {
            log.error("Failed to send welcome email: " + e.getMessage());
        }
    }

    public void sendOtpEmail(String toEmail, String otpCode, String userName) {
        // For development: Print to console instead of sending email
        System.out.println("\n");
        System.out.println("═══════════════════════════════════════");
        System.out.println("📧 OTP VERIFICATION EMAIL");
        System.out.println("═══════════════════════════════════════");
        System.out.println("TO: " + toEmail);
        System.out.println("NAME: " + userName);
        System.out.println("\n🔐 YOUR OTP CODE:");
        System.out.println("╔═══════════════════╗");
        System.out.println("║  " + otpCode + "       ║");
        System.out.println("╚═══════════════════╝");
        System.out.println("\nExpiracy: 10 minutes");
        System.out.println("═══════════════════════════════════════\n");
        
        log.info("OTP sent to: " + toEmail);
    }
}