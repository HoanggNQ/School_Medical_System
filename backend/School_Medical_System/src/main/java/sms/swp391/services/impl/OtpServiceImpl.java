package sms.swp391.services.impl;

import lombok.RequiredArgsConstructor;
import org.apache.commons.lang3.RandomStringUtils;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.enums.TemplateEnum;
import sms.swp391.models.dtos.requests.OTPVerifyRequestDTO;
import sms.swp391.models.entities.UserEntity;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.models.exception.NotFoundException;
import sms.swp391.models.exception.ValidationFailedException;
import sms.swp391.repositories.UserRepository;
import sms.swp391.services.OTPService;
import sms.swp391.services.SendMailService;

import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class OtpServiceImpl implements OTPService {

    private final PasswordEncoder passwordEncoder;

    private final SendMailService mailSenderService;
    private final UserRepository userRepository;
    private Long timeOut = (long) 3.0;
    //  private Long timeOutPassword = (long) 3.0;
    private final RedisTemplate<String, Object> redisTemplate;

    @Override
    public void generateOTPCode(String email, String template) {
        // Check if an OTP already exists
        String existingOtp = (String) redisTemplate.opsForHash().get(email, "otp");
        if (existingOtp != null) {
            // Calculate remaining TTL
            Long timeToLive = redisTemplate.getExpire(email, TimeUnit.SECONDS);
            if (timeToLive != null && timeToLive > 0) {
                long minutes = timeToLive / 60;
                long seconds = timeToLive % 60;
                throw new ActionFailedException(
                        String.format("OTP has already been sent. Please wait %d minute(s) and %d second(s) before requesting again.", minutes, seconds)
                );
            } else {
                // TTL is negative or not set – delete the key to reset
                redisTemplate.delete(email);
            }
        }
        // Generate and store a new OTP
        String value = generateRandomOTP();
        redisTemplate.opsForValue().set(email, value, timeOut, TimeUnit.MINUTES);

        // Send email
        mailSenderService.sendOtpEmail(email, value, template);
    }



    @Override
    public void changePasswordOtp(String email,  String newPassword) {
        if (Boolean.TRUE.equals(redisTemplate.hasKey(email))) {
            String otpInRedis = (String) redisTemplate.opsForHash().get(email, "otp");
            if (otpInRedis != null) {
                throw new ActionFailedException("OTP has been sent. Please check your email !");
            }
        }
        String template = TemplateEnum.PASSWORD.toString();
        var otp = generateRandomOTP();
        redisTemplate.opsForHash().put(email, "otp", otp);        // Lưu OTP vào field "otp"
        String password = passwordEncoder.encode(newPassword);
        redisTemplate.opsForHash().put(email, "password", password); // Lưu password vào field "password"
        redisTemplate.expire(email, timeOut, TimeUnit.MINUTES);
        mailSenderService.sendOtpEmail(email, otp,template);
    }


    @Override
    public void generateOTPCodeAgain(String email, String template) {
        if (Boolean.TRUE.equals(redisTemplate.hasKey(email))) {
            String otpInRedis = (String) redisTemplate.opsForHash().get(email, "otp");
            if (otpInRedis != null) {
                throw new ActionFailedException("OTP has been sent. Please check your email !");
            }
        }
        if (template == null) {
            throw new ActionFailedException("template is null");
        }
        UserEntity check = userRepository.findByEmail(email).orElseThrow(
                () -> new NotFoundException(email + " này chưa được đăng kí")
        );
        if (check.getStatus().equals(StatusEnum.DELETED)) {
            throw new ActionFailedException("account has been deleted");
        }
        if (check.getStatus().equals(StatusEnum.BAN)) {
            throw new ActionFailedException("account has been ban");
        }
        if (!TemplateEnum.PASSWORD.toString().equals(template)) {
            if (check.getStatus().equals(StatusEnum.ACTIVE)) {
                throw new ActionFailedException(email + " đã đăng kí rồi");
            }
        }
        var value = generateRandomOTP();
        redisTemplate.delete(email);
        redisTemplate.opsForValue().set(email, value, timeOut, TimeUnit.MINUTES); // Sử dụng email làm key
        mailSenderService.sendOtpEmail(email, value, template);
    }


    @Override
    public void verifyOTP(OTPVerifyRequestDTO request) {
        var storedOtp = (String) redisTemplate.opsForValue().get(request.getEmail()); // Lấy OTP bằng email
        if (storedOtp == null) {
            throw new ValidationFailedException("This OTP is not valid or expired");
        }
        if (!storedOtp.equals(request.getOtp())) {
            throw new ValidationFailedException("The OTP doesn't match");
        }
        redisTemplate.delete(request.getEmail());
    }

    @Override
    public String verifyOtpSetPassword(OTPVerifyRequestDTO request) {
        String otpInRedis = (String) redisTemplate.opsForHash().get(request.getEmail(), "otp");
        String password = (String) redisTemplate.opsForHash().get(request.getEmail(), "password");

        if (otpInRedis == null) {
            throw new ValidationFailedException("This OTP is not valid or has expired");
        }
        if (!otpInRedis.equals(request.getOtp())) {
            throw new ValidationFailedException("The OTP does not match");
        }
        redisTemplate.delete(request.getEmail());
        return password;
    }

    @Override
    public void resendOTPSetPassword(String email) {
        if (Boolean.TRUE.equals(redisTemplate.hasKey(email))) {
            String otpInRedis = (String) redisTemplate.opsForHash().get(email, "otp");
            if (otpInRedis != null) {
                throw new ActionFailedException("OTP has been sent. Please check your email !");
            }
        }
        UserEntity userEntity = userRepository.findByEmail(email).orElseThrow(
                ()-> new NotFoundException("user not found")
        );
        if(userEntity.getStatus().equals(StatusEnum.DELETED)){
            throw  new ActionFailedException("account has been deleted");
        }
        if(userEntity.getStatus().equals(StatusEnum.BAN)){
            throw new ActionFailedException("account has been ban");
        }
        if(userEntity.getStatus().equals(StatusEnum.VERIFY)){
            throw new ActionFailedException("account has been not verify");
        }
        var otpValue = generateRandomOTP();
        String template = TemplateEnum.PASSWORD.toString();

        redisTemplate.opsForHash().put(email, "otp", otpValue);
        redisTemplate.expire(email, timeOut, TimeUnit.MINUTES);
        mailSenderService.sendOtpEmail(email, otpValue, template);
    }


    private String generateRandomOTP() {
        String otp;
        do {
            otp = RandomStringUtils.randomNumeric(6);
        } while (redisTemplate.opsForValue().get(otp) != null);
        return otp;
    }
}
