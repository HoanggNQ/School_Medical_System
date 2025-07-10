package sms.swp391.models.entities;

import jakarta.persistence.*;
import lombok.*;
import sms.swp391.models.dtos.enums.FileCloudStatus;

import java.time.LocalDateTime;

@Builder
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity(name = "file_clouds")
public class FileCloud {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @Column(name = "id")
    private String id;

    @Column(name = "filename", nullable = false)
    private String fileName;

    @Column(name = "extension", nullable = false)
    private String extension;

    @Column(name = "file_cloud_id", nullable = false)
    private String fileCloudId;

    @Column(name = "is_removed", nullable = false)
    private boolean isRemoved;
    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private FileCloudStatus status = FileCloudStatus.UPLOADED;

    @Column(name = "created_date", nullable = false)
    private LocalDateTime createdDate;

    @Column(name = "updated_date", nullable = false)
    private LocalDateTime updatedDate;

    @PrePersist
    protected void onCreate() {
        createdDate = LocalDateTime.now();
        updatedDate = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedDate = LocalDateTime.now();
    }
}