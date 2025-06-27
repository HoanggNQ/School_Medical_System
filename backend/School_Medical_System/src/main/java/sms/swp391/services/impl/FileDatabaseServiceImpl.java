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

    @Transactional(rollbackFor = {ActionFailedException.class})
    @Override
    public List<FileObjectResponse> upMultipleFile(List<MultipartFile> files) {
        if (files == null || files.isEmpty()) {
            throw new ActionFailedException("Failed to upload files: No files provided.");
        }

        List<FileObjectResponse> responses = new ArrayList<>();
        for (MultipartFile file : files) {
            try {
                responses.add(uploadFile(file));
            } catch (ActionFailedException e) {
                log.warn("Skipping file {} due to upload failure: {}", file.getOriginalFilename(), e.getMessage());

            }
        }
        return responses;
    }

    @Override
    public FileObjectResponse uploadFilev(FileObject file) {
        if (file == null || file.getFile() == null || file.getFileName() == null || file.getFileName().isEmpty()) {
            throw new ActionFailedException("Failed to upload filev: FileObject or its content is empty.");
        }
        try {
            String publicId = UUID.randomUUID().toString();

            Map<String, Object> uploadOptions = ObjectUtils.asMap(
                    "public_id", publicId,
                    "resource_type", "auto"
            );

            Map uploadResult = cloudinary.uploader().upload(file.getFile(), uploadOptions);

            String fileUrl = (String) uploadResult.get("secure_url");
            String fileNameOnCloud = (String) uploadResult.get("public_id");
            log.info("FileObject uploaded to Cloudinary: {}", fileUrl);

            return returnToFileObjectResponse(file, fileUrl); // Reuse existing utility
        } catch (IOException ex) {
            log.error("Failed to read file bytes from FileObject {}: {}", file.getFileName(), ex.getMessage());
            throw new ActionFailedException("Failed to upload FileObject due to IO error: " + ex.getMessage());
        } catch (Exception ex) {
            log.error("An unexpected error occurred during Cloudinary upload for FileObject {}: {}", file.getFileName(), ex.getMessage());
            throw new ActionFailedException("Failed to upload FileObject to Cloudinary: " + ex.getMessage());
        }
    }


    @Override
    public FileObjectResponse downloadFile(FileObject file) {

        log.warn("downloadFile method is called. For Cloudinary, files are accessed via URLs. " +
                "Direct byte[] download from backend is usually not required. If specific download functionality is needed," +
                " it would involve fetching the file from its Cloudinary URL via HTTP client or Cloudinary's specific SDK download features.");
        throw new UnsupportedOperationException("downloadFile is not directly supported in this Cloudinary setup as files are primarily accessed via URLs. Clients should use the provided URL to download.");
    }

    public FileObjectResponse returnToFileObjectResponse(FileObject file, String url) {
        return FileObjectResponse.builder()
                .fileName(file.getFileName())
                .file(file.getFile())
                .path(file.getPath())
                .url(url)
                .build();
    }


    private String determineContentType(String filename) {
        if (filename == null) return "application/octet-stream"; // Handle null filename
        if (filename.endsWith(".pdf")) {
            return "application/pdf";
        } else if (filename.endsWith(".webp")) {
            return "image/webp";
        } else if (filename.endsWith(".jpg") || filename.endsWith(".jpeg")) {
            return "image/jpeg";
        } else if (filename.endsWith(".png")) {
            return "image/png";
        }
        return "application/octet-stream";
    }
}
