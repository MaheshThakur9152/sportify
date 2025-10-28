package com.sportify.service;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class SendGridEmailService {

    private static final Logger log = LoggerFactory.getLogger(SendGridEmailService.class);

    @Value("${sendgrid.api.key}")
    private String sendGridApiKey;

    public void sendOtpEmail(String toEmail, String otpCode, String userName) {
        log.info("=== SENDING OTP VIA SENDGRID ===");
        log.info("To: " + toEmail);
        log.info("OTP: " + otpCode);

        try {
            SendGrid sg = new SendGrid(sendGridApiKey);
            Request request = new Request();

            Email from = new Email("devsportify7@gmail.com", "SPORTIFY");
            Email to = new Email(toEmail);
            Content content = new Content("text/html", getEmailHtml(otpCode, userName));
            Mail mail = new Mail(from, "SPORTIFY Verification Code: " + otpCode, to, content);

            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());

            Response response = sg.api(request);

            log.info("Status Code: " + response.getStatusCode());
            log.info("=== EMAIL SENT SUCCESSFULLY ===");

        } catch (IOException ex) {
            log.error("Failed to send email: " + ex.getMessage());
            throw new RuntimeException("Email send failed: " + ex.getMessage());
        }
    }

    private String getEmailHtml(String otpCode, String userName) {
        return "<html>" +
            "<body style='font-family: Arial; background-color: #f5f5f5; padding: 20px;'>" +
            "<div style='max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;'>" +
            "<h2 style='color: #000;'>Welcome to SPORTIFY, " + userName + "!</h2>" +
            "<p>Your verification code is:</p>" +
            "<div style='background-color: #000; color: white; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;'>" +
            "<h1 style='letter-spacing: 8px; margin: 0;'>" + otpCode + "</h1>" +
            "</div>" +
            "<p>This code expires in <strong>10 minutes</strong></p>" +
            "<p>If you didn't request this code, please ignore this email.</p>" +
            "<hr style='border: none; border-top: 1px solid #e5e5e5;'>" +
            "<p style='font-size: 12px; color: #757575;'>© 2025 SPORTIFY. All rights reserved.</p>" +
            "</div>" +
            "</body>" +
            "</html>";
    }
}