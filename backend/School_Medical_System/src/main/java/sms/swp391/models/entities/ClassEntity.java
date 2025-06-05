package sms.swp391.models.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.*;
import org.hibernate.annotations.ColumnDefault;

import java.util.LinkedHashSet;
import java.util.Set;

@Getter
@Setter
@Entity
@AllArgsConstructor
@NoArgsConstructor
@Builder
@Table(name = "class")
public class ClassEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id", nullable = false)
    private Long id;

    @Size(max = 100)
    @NotNull
    @Column(name = "class_name", nullable = false, length = 100)
    private String className;

    @NotNull
    @Column(name = "grade", nullable = false)
    private Integer grade;

    @ColumnDefault("0")
    @Column(name = "totalstudent")
    private Integer totalstudent;

    @OneToMany(mappedBy = "classEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StudentEntity> students = new LinkedHashSet<>();


}