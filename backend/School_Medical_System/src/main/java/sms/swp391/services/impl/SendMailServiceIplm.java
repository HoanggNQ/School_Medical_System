package sms.swp391.services.impl;

import ch.qos.logback.core.joran.spi.ActionException;
import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import sms.swp391.models.dtos.enums.TemplateEnum;
import sms.swp391.services.SendMailService;

import java.io.IOException;

@Service
@RequiredArgsConstructor
public class SendMailServiceIplm implements SendMailService {

    private String fromEmail = "hoangnqse160625@fpt.edu.vn";
    private final TemplateEngine templateEngine;

    @Autowired
    private JavaMailSender mailSender;

    @Override
    public void sendMail(MultipartFile[] files, String to, String[] cc, String subject, String body) {
        try {
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true); // true để bật multipart
            helper.setFrom(fromEmail);
            helper.setTo(to);
            if (cc != null && cc.length > 0) {
                helper.setCc(cc);
            }
            helper.setSubject(subject);
            helper.setText(body, true); // true để bật HTML content

            if (files != null && files.length > 0) {
                for (MultipartFile file : files) {
                    if (!file.isEmpty()) {
                        String fileName = file.getOriginalFilename();
                        helper.addAttachment(fileName, new ByteArrayResource(file.getBytes()) {
                            @Override
                            public String getFilename() {
                                return fileName; // Trả về tên file gốc
                            }
                        });
                    }
                }
            }

            mailSender.send(mimeMessage);

        } catch (MessagingException e) {
            new ActionException("Error sending email: " + e.getMessage());
        } catch (IOException exception) {
            new ActionException("Error sending email: " + exception.getMessage());
        }

    }

    @Override
    public void sendOtpEmail(String toEmail, String otp, String template) {
        try {

            Context context = new Context();
            context.setVariable("Email", toEmail);
            context.setVariable("OTP", otp);
            String content = "";
            MimeMessage mimeMessage = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(mimeMessage, true);
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);

            if (TemplateEnum.ACCOUNT.name().equals(template)) {
                content = templateEngine.process("SendOTPTemplate", context);
                helper.setSubject("OTP VERIFY ACCOUNT - MEDICAL SCHOOL SYSTEM");
            } else if (TemplateEnum.PASSWORD.name().equals(template)) {
                content = templateEngine.process("SendOTPPasswordTemplate", context);
                helper.setSubject("OTP SET PASSWORD - MEDICAL SCHOOL SYSTEM");
            } else {
                throw new IllegalArgumentException("Invalid template type provided");
            }

            helper.setText(content, true);

            // Gửi email
            mailSender.send(mimeMessage);
        } catch (MessagingException exception) {
            throw new RuntimeException("Error while sending email: " + exception.getMessage());
        }
    }
}
