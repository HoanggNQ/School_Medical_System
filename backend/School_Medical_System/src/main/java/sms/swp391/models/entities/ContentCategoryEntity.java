package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "content_category", schema = "public")
public class ContentCategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "contentcategory_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "contentcategory_name")
    private String contentcategoryName;

    @OneToMany(mappedBy = "contentCategoryEntity")
    private Set<ContentEntity> contentEntities = new LinkedHashSet<>();

}