package sms.swp391.services;

import org.springframework.web.multipart.MultipartFile;

public interface SendMailService {
    void sendMail(MultipartFile[] file, String to, String[] cc, String subject, String body);
    void sendOtpEmail(String toEmail, String otp,String template);
    void sendConsultationScheduleEmail(String toEmail, String studentName, String scheduleTime, String reason);
    void sendConsentRequestEmail(String toEmail, String parentName, String studentName, String campaignName, String startDate,String endDate, String location);
    void sendReminderEmail(String toEmail, String parentName, String studentName, String campaignName, String startDate, String endDate, String location);
}
