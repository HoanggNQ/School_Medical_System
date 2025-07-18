package sms.swp391.models.entities;

import jakarta.persistence.*;
import lombok.*;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "student_health_profile")
public class StudentHealthProfileEntity {
    @Id
    private Long studentId;

    @MapsId
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "student_id")
    private StudentEntity student;

    @Column(name = "height_cm")
    private Double height;

    @Column(name = "weight_kg")
    private Double weight;

    @Column(name = "bmi")
    private Double bmi;

    @Column(name = "vision_left", length = 10)
    private String visionLeft;

    @Column(name = "vision_right", length = 10)
    private String visionRight;

    @Column(name = "hearing", columnDefinition = "TEXT")
    private String hearing;

    @Column(name = "dental_health", columnDefinition = "TEXT")
    private String dentalHealth;

    @Column(name = "blood_pressure", length = 20)
    private String bloodPressure;

    @Column(name = "pulse")
    private Integer pulse;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "blood_type", length = 10)
    private String bloodType;

    @Column(name = "genetic_diseases", columnDefinition = "TEXT")
    private String geneticDiseases;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "chronic_diseases", columnDefinition = "TEXT")
    private String chronicDiseases;

}