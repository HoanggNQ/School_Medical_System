package sms.swp391.utils;

import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import sms.swp391.models.exception.ConflictException;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

@Component
public class FileUploadUtil {
    private final String UPLOAD_DIR = "uploads";

    public String saveFile(String subdirectory, MultipartFile file) {
        try {
            // Create directories if they don't exist
            Path uploadPath = Paths.get(UPLOAD_DIR, subdirectory);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // Generate unique filename
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Path filePath = uploadPath.resolve(filename);

            // Copy file to the target location
            try (InputStream inputStream = file.getInputStream()) {
                Files.copy(inputStream, filePath, StandardCopyOption.REPLACE_EXISTING);
            }

            return subdirectory + "/" + filename;
        } catch (IOException e) {
            throw new ConflictException("Could not save file: " + file.getOriginalFilename());
        }
    }

    public void deleteFile(String filePath) {
        try {
            Path path = Paths.get(UPLOAD_DIR, filePath);
            Files.deleteIfExists(path);
        } catch (IOException e) {
            throw new ConflictException("Could not delete file: " + filePath);
        }
    }
} 