package sms.swp391.repositories;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.entities.UserEntity;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    Optional<UserEntity> findByUsername(String username);
    boolean existsByUsername(String username);


    boolean existsByPhoneNumber(String phoneNumber);

    @Query("SELECT u FROM UserEntity u WHERE " +
            "(LOWER(u.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR " +
            "LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
            "AND u.status = 'ACTIVE'")
    Page<UserEntity> searchUsers(@Param("keyword") String keyword, Pageable pageable);


    @Query("SELECT u FROM UserEntity u WHERE u.userId = :userId AND u.roleName = 'STUDENT'")
    Optional<UserEntity> findByStudentIdAndRoleName(@Param("userId") Long userId);

    @Query("SELECT u FROM UserEntity u WHERE u.roleName = :role")
    Page<UserEntity> searchUsersByRoleName(@Param("role") RoleEnum role, Pageable pageable);



    @Query("SELECT u FROM UserEntity u WHERE u.userId = :userId AND u.roleName = 'PARENT'")
    Optional<UserEntity> findByParentIdAndRoleName(@Param("userId") Long userId);
    Optional<UserEntity> findByEmail(String email);

    Optional<UserEntity> findByPhoneNumber(String phoneNumber);

//    Optional<UserEntity> findByUserId(Long userId);
//    @Query("SELECT u FROM UserEntity u WHERE u.userId = :keyword AND u.roleName = 'STUDENT'")
//    Optional<UserEntity> findStudentByUserId(@Param("keyword") String keyword);

}
