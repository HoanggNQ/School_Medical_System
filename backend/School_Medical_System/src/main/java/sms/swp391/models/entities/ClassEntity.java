package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.ColumnDefault;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@Table(name = "class")
public class ClassEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id", nullable = false)
    private Long id;

    @Column(name = "grade")
    private Integer grade;

    @ColumnDefault("0")
    @Column(name = "totalstudent")
    private Integer totalstudent;

    @Size(max = 100)
    @Column(name = "class_name", length = 100)
    private String className;

    @OneToMany(mappedBy = "studentClass")
    private Set<StudentEntity> students = new LinkedHashSet<>();

}