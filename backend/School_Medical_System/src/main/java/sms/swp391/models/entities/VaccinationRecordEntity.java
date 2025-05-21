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
@Table(name = "vaccination_records")
public class VaccinationRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "vaccination_id", nullable = false)
    private Long id;

    @Size(max = 255)
    @Column(name = "vaccination_type")
    private String vaccinationType;

    @Column(name = "vaccination_description", length = Integer.MAX_VALUE)
    private String vaccinationDescription;

    @OneToMany(mappedBy = "vaccination")
    private Set<StudentVaccinationEntity> studentVaccinations = new LinkedHashSet<>();

}