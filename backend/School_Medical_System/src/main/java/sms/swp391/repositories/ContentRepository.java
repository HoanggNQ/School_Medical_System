// src/main/java/sms/swp391/repositories/ContentRepository.java
package sms.swp391.repositories;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import sms.swp391.models.entities.ContentEntity;
import io.lettuce.core.dynamic.annotation.Param;

import java.util.List;

public interface ContentRepository extends JpaRepository<ContentEntity, Long> {
    List<ContentEntity> findByContentCategoryEntity_Id(Long contentCategoryId);

    @Query("SELECT c FROM ContentEntity c WHERE LOWER(c.title) LIKE LOWER(CONCAT('%', :keyword, '%'))")
    Page<ContentEntity> searchContents(@Param("keywork")String keyword, Pageable pageable);
}