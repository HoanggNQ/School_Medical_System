package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "content", schema = "public")
public class ContentEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "title", nullable = false)
    private String title;

    @Column(name = "body_content", nullable = false)
    private String bodyContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contentcategory_id", nullable = false)
    private ContentCategoryEntity contentCategoryEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private UserEntity createdBy;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}