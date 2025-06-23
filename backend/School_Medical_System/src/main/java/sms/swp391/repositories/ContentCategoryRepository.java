package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import sms.swp391.models.entities.ContentCategoryEntity;

public interface ContentCategoryRepository extends JpaRepository<ContentCategoryEntity, Long> {
}