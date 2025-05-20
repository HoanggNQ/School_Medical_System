package sms.swp391.services;

import org.springframework.web.multipart.MultipartFile;

public interface SendMailService {
    void sendMail(MultipartFile[] file, String to, String[] cc, String subject, String body);
    void sendOtpEmail(String toEmail, String otp,String template);

}
