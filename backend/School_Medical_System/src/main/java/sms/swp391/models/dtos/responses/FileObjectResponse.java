package sms.swp391.models.dtos.responses;

import lombok.*;
import lombok.experimental.SuperBuilder;
import sms.swp391.models.dtos.requests.FileObject;

@Data
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder()
@EqualsAndHashCode(callSuper = true)
public class FileObjectResponse extends FileObject {
    private String url;
}
