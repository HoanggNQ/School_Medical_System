package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.enums.TemplateEnum;
import sms.swp391.models.dtos.requests.OTPVerifyRequest;
import sms.swp391.models.entities.OtpEntity;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.models.exception.ValidationFailedException;
import sms.swp391.repositories.OtpRepository;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.OTPService;
import sms.swp391.services.SendMailService;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OTPService {

    private final PasswordEncoder passwordEncoder;
    private final SendMailService mailSenderService;
    private final UserRepository userRepository;
    private final OtpRepository otpRepository;
    private final Long timeOut = 3L; // in minutes

    private static final String OTP_ALREADY_SENT = "OTP has been sent. Please check your email!";

    @Override
    public void generateOTPCode(String email, String template) {
        otpRepository.findByEmail(email).ifPresent(this::checkOtpAlreadySent);
        createAndSendOtp(email, template, null);
    }

    @Override
    public void generateOTPCodeAgain(String email, String template) {
        otpRepository.findByEmail(email).ifPresent(this::checkOtpAlreadySent);

        if (template == null) {
            throw new ActionFailedException("template is null");
        }

        UserEntity user = userRepository.findByEmail(email).orElseThrow(
                () -> new NotFoundException(email + " này chưa được đăng kí")
        );

        validateUserStatus(user, template);
        createAndSendOtp(email, template, null);
    }

    @Override
    public void verifyOTP(OTPVerifyRequest request) {
        validateOtp(request.getEmail(), request.getOtp());
        otpRepository.deleteByEmail(request.getEmail());
    }

    @Override
    public void changePasswordOtp(String email, String newPassword) {
        otpRepository.findByEmail(email).ifPresent(this::checkOtpAlreadySent);

        String encodedPassword = passwordEncoder.encode(newPassword);
        createAndSendOtp(email, TemplateEnum.PASSWORD.name(), encodedPassword);
    }

    @Override
    public String verifyOtpSetPassword(OTPVerifyRequest request) {
        OtpEntity otpEntity = validateOtp(request.getEmail(), request.getOtp());
        String password = otpEntity.getPassword();
        otpRepository.deleteByEmail(request.getEmail());
        return password;
    }

    @Override
    public void resendOTPSetPassword(String email) {
        otpRepository.findByEmail(email).ifPresent(this::checkOtpAlreadySent);

        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(
                () -> new NotFoundException("user not found")
        );

        validateUserStatus(userEntity, TemplateEnum.PASSWORD.name());
        createAndSendOtp(email, TemplateEnum.PASSWORD.name(), null);
    }

    private String generateRandomOTP() {
        return RandomStringUtils.randomNumeric(6);
    }

    private void createAndSendOtp(String email, String template, String encodedPassword) {
        String otp = generateRandomOTP();
        Instant now = Instant.now();
        Instant expiry = now.plus(timeOut, ChronoUnit.MINUTES);

        otpRepository.deleteByEmail(email);
        otpRepository.save(OtpEntity.builder()
                .email(email)
                .otp(otp)
                .template(template)
                .password(encodedPassword)
                .createdAt(now)
                .expiresAt(expiry)
                .build());

        mailSenderService.sendOtpEmail(email, otp, template);
    }

    private void validateUserStatus(UserEntity user, String template) {
        if (user.getStatus().equals(StatusEnum.DELETED)) {
            throw new ActionFailedException("account has been deleted");
        }
        if (user.getStatus().equals(StatusEnum.BAN)) {
            throw new ActionFailedException("account has been ban");
        }
        if (user.getStatus().equals(StatusEnum.VERIFY )&& TemplateEnum.PASSWORD.name().equals(template)) {
            throw new ActionFailedException("account has been not verify");
        }
        if (user.getStatus().equals(StatusEnum.ACTIVE ) && !TemplateEnum.PASSWORD.name().equals(template)) {
            throw new ActionFailedException(user.getEmail() + " đã đăng kí rồi");
        }
    }

    private void checkOtpAlreadySent(OtpEntity otp) {
        if (otp.getExpiresAt().isAfter(Instant.now())) {
            long secondsLeft = otp.getExpiresAt().getEpochSecond() - Instant.now().getEpochSecond();
            throw new ActionFailedException("OTP already sent. Please wait " + (secondsLeft / 60) + " minutes.");
        }
    }

    private OtpEntity validateOtp(String email, String inputOtp) {
        OtpEntity otpEntity = otpRepository.findByEmail(email)
                .orElseThrow(() -> new ValidationFailedException("OTP is not valid or expired"));

        if (otpEntity.getExpiresAt().isBefore(Instant.now())) {
            otpRepository.deleteByEmail(email);
            throw new ValidationFailedException("OTP has expired");
        }

        if (!otpEntity.getOtp().equals(inputOtp)) {
            throw new ValidationFailedException("OTP does not match");
        }

        return otpEntity;
    }
}
