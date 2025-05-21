package sms.swp391.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import sms.swp391.models.entities.UserEntity;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    boolean existsByUsername(String username);

    boolean existsByEmail(String email);

    boolean existsByPhoneNumber(String phoneNumber);

//    @Query("SELECT u FROM UserEntity u WHERE " +
//            "LOWER(u.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
//            "LOWER(u.mail) LIKE LOWER(CONCAT('%', :keyword, '%'))")
//    Page<UserEntity> findByKeyword(String keyword, Pageable pageable);

    Optional<UserEntity> findByEmail(String email);
}
