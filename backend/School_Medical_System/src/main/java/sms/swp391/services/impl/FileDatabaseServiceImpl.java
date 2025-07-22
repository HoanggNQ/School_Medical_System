package sms.swp391.services.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.dtos.enums.FileCloudStatus;
import sms.swp391.models.dtos.requests.FileObject;
import sms.swp391.models.dtos.responses.FileObjectResponse;
import sms.swp391.models.entities.FileCloud;
import sms.swp391.models.exception.ActionFailedException;
import sms.swp391.repositories.FileCloudRepository;
import sms.swp391.services.FileDatabaseService;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class FileDatabaseServiceImpl implements FileDatabaseService {

    private final FileCloudRepository fileCloudRepository;
    private final Cloudinary cloudinary; // Inject the Cloudinary bean

    @Transactional(rollbackFor = {ActionFailedException.class})
    @Override
    public FileObjectResponse uploadFile(MultipartFile file) {
        if (file.isEmpty()) {
            throw new ActionFailedException("Failed to upload file: file is empty.");
        }
        try {
            String publicId = UUID.randomUUID().toString();
            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                    "public_id", publicId,
                    "resource_type", "auto"
            );
            Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadOptions);

            String fileUrl = (String) uploadResult.get("secure_url");
            String fileNameOnCloud = (String) uploadResult.get("public_id");
            FileCloud fileDb = FileCloud.builder()
                    .fileCloudId(publicId)
                    .fileName(fileNameOnCloud)
                    .extension(file.getContentType())
                    .isRemoved(false)
                    .status(FileCloudStatus.UPLOADED)
                    .build();
            fileCloudRepository.save(fileDb);

            log.info("File uploaded to Cloudinary: {}", fileUrl);

            return FileObjectResponse.builder()
                    .fileName(file.getOriginalFilename())
                    .url(fileUrl)
                    .build();

        } catch (IOException ex) {
            log.error("Failed to read file bytes from MultipartFile {}: {}", file.getOriginalFilename(), ex.getMessage());
            throw new ActionFailedException("Failed to upload file due to IO error: " + ex.getMessage());
        } catch (Exception ex) {
            log.error("An unexpected error occurred during Cloudinary upload for file {}: {}", file.getOriginalFilename(), ex.getMessage());
            throw new ActionFailedException("Failed to upload file to Cloudinary: " + ex.getMessage());
        }
    }

}
