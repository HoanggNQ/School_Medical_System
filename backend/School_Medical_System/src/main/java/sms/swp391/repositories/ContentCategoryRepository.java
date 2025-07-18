package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sms.swp391.models.entities.ContentCategoryEntity;
import org.springframework.stereotype.Repository;
@Repository
public interface ContentCategoryRepository extends JpaRepository<ContentCategoryEntity, Long> {
}