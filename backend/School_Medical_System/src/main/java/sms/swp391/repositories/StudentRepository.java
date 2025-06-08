package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.StudentEntity;

@Repository
public interface StudentRepository extends JpaRepository<StudentEntity, Long> {
} 