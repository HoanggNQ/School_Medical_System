package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Getter
@Setter
@Entity
@Table(name = "chronic_disease", schema = "public")
public class ChronicDiseaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "chronic_disease_id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JoinColumn(name = "student_id")
    private StudentEntity studentEntity;

    @Size(max = 255)
    @Column(name = "chronic_disease_name")
    private String chronicDiseaseName;

    @Column(name = "chronic_disease_description", length = Integer.MAX_VALUE)
    private String chronicDiseaseDescription;

}