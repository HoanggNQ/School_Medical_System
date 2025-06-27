package sms.swp391.models.dtos.requests;

import lombok.*;
import lombok.experimental.SuperBuilder;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class FileObject {
    private String fileName;
    private byte[] file;
    private String path;
}
