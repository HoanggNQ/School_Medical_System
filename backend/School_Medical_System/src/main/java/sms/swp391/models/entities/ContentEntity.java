package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Entity
@Table(name = "content", schema = "public")
public class ContentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "title")
    private String title;

    @Column(name = "body_content", length = Integer.MAX_VALUE)
    private String bodyContent;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "contentcategory_id")
    private ContentCategoryEntity contentCategoryEntity;

}