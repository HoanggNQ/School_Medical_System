package sms.swp391.services;

import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.requests.FileObject;
import sms.swp391.models.dtos.responses.FileObjectResponse;

import java.util.List;

public interface FileDatabaseService {
    FileObjectResponse uploadFile (MultipartFile file);

}
