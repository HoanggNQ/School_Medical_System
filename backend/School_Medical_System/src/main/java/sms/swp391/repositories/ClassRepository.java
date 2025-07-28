package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.ClassEntity;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

@Repository
public interface ClassRepository extends JpaRepository<ClassEntity, Long> {
    @Query("SELECT DISTINCT c FROM ClassEntity c LEFT JOIN FETCH c.students s LEFT JOIN FETCH s.user")
    List<ClassEntity> findAllWithStudentsAndUser();
}