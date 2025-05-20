package sms.swp391.controllers;


import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.respones.JwtResponse;
import sms.swp391.models.dtos.respones.ResponseObject;
import sms.swp391.services.SendMailService;

@RestController
@RequestMapping("/api/v1/mail")
public class SendMailController {
    private final SendMailService sendMailService;

    public SendMailController(SendMailService sendMailService) {
        this.sendMailService = sendMailService;
    }


    @PostMapping(value = "/sendMail", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> sendMail(
            @RequestPart("files") MultipartFile[] files,
            @RequestParam(value = "to", required = true) String to,
            @RequestParam(value = "cc", required = false) String[] cc,
            @RequestParam(value = "subject", required = true) String subject,
            @RequestParam(value = "body", required = true) String body) {


        try {
            sendMailService.sendMail(files, to, cc, subject, body);

            return ResponseEntity.ok().body(
                    ResponseObject.builder()
                            .code("SEND_MAIL_SUCCESS")
                            .message("Send mail successfully")
                            .status(HttpStatus.OK)
                            .isSuccess(true)
                            .data(null)
                            .build()
            );
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    ResponseObject.builder()
                            .code("SEND_MAIL")
                            .message("Failed to Send mail: " + e.getMessage())
                            .status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .isSuccess(false)
                            .data(null)
                            .build()
            );
        }
    }
}
