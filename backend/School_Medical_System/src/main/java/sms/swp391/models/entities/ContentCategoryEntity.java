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
@Table(name = "content_category")
public class ContentCategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "content_category_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "content_category_name")
    private String contentCategoryName;

    @OneToMany(mappedBy = "contentCategory")
    private Set<ContentEntity> contents = new LinkedHashSet<>();

}