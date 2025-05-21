package sms.swp391.models.entities;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

import java.util.LinkedHashSet;
import java.util.Set;

@Entity
@Table(name = "parent", schema = "public")
@Getter
@Setter
public class ParentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "parent_id", nullable = false)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private UserEntity userEntity;

    @OneToMany(mappedBy = "parentEntity", cascade = CascadeType.ALL, orphanRemoval = true)
    private Set<StudentEntity> studentEntities = new LinkedHashSet<>();
}
