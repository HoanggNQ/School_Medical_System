package sms.swp391.models.dtos.responses;

import lombok.*;

@Data
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JwtResponse {
    private String accessToken;
    private String refreshToken;
    private String tokenType = "Bearer";
    private long expiresIn;
    private UserInfo user;

    @Data
    public static class UserInfo {
        private Long id;
        private String username;
        private String email;
        private String role;
        private String urlAvatar;


        public UserInfo(Long id, String username, String email, String role, String urlAvatar) {
            this.id = id;
            this.username = username;
            this.email = email;
            this.role = role;
            this.urlAvatar = urlAvatar;
        }
    }

    public JwtResponse(String accessToken, String refreshToken, long expiresIn, UserInfo userInfo) {
        this.accessToken = accessToken;
        this.refreshToken = refreshToken;
        this.expiresIn = expiresIn;
        this.user = userInfo;
    }
}
