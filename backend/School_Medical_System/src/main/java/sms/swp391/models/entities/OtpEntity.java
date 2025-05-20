package sms.swp391.models.entities;

import jakarta.persistence.*;
import lombok.*;

import java.time.Instant;

@Entity
@Table(name = "otp")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OtpEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String email;

    private String otp;

    private String password; // Dùng trong TH reset password, có thể null nếu không dùng

    private String template; // ACCOUNT / PASSWORD

    private Instant createdAt;

    private Instant expiresAt;
}
