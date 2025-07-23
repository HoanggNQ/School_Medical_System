package sms.swp391.repositories;

import io.lettuce.core.dynamic.annotation.Param;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.enums.StatusEnum;
import sms.swp391.models.dtos.responses.UserDashboardStatsDTO;
import sms.swp391.models.entities.UserEntity;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<UserEntity, Long> {
    boolean existsByUsername(String username);


    boolean existsByPhoneNumber(String phoneNumber);

    @Query("""
                SELECT u FROM UserEntity u 
                WHERE (
                    LOWER(u.fullname) LIKE LOWER(CONCAT('%', :keyword, '%')) OR 
                    LOWER(u.username) LIKE LOWER(CONCAT('%', :keyword, '%'))
                )
                AND u.status = 'ACTIVE'
            """)
    Page<UserEntity> searchUsers(@Param("keyword") String keyword, Pageable pageable);


    @Query("SELECT u FROM UserEntity u WHERE u.roleName = :role")
    Page<UserEntity> searchUsersByRoleName(@Param("role") RoleEnum role, Pageable pageable);


    @Query("SELECT u FROM UserEntity u LEFT JOIN FETCH u.studentEntity WHERE u.email = :email")
    Optional<UserEntity> findByEmail(@Param("email") String email);

    Optional<UserEntity> findByPhoneNumber(String phoneNumber);

    List<UserEntity> findByRoleName(RoleEnum roleName);

    boolean existsByEmail(String email);

    @Query("""
                SELECT new sms.swp391.models.dtos.responses.UserDashboardStatsDTO(
                    COUNT(u),
            
                    SUM(CASE WHEN u.roleName = :#{T(sms.swp391.models.dtos.enums.RoleEnum).STUDENT}      THEN 1 ELSE 0 END),
                    SUM(CASE WHEN u.roleName = :#{T(sms.swp391.models.dtos.enums.RoleEnum).PARENT}       THEN 1 ELSE 0 END),
                    SUM(CASE WHEN u.roleName = :#{T(sms.swp391.models.dtos.enums.RoleEnum).SCHOOL_NURSE} THEN 1 ELSE 0 END),
                    SUM(CASE WHEN u.roleName = :#{T(sms.swp391.models.dtos.enums.RoleEnum).ADMIN}        THEN 1 ELSE 0 END),
            
                    SUM(CASE WHEN u.status = :#{T(sms.swp391.models.dtos.enums.StatusEnum).ACTIVE}  THEN 1 ELSE 0 END),
                    SUM(CASE WHEN u.status = :#{T(sms.swp391.models.dtos.enums.StatusEnum).VERIFY}  THEN 1 ELSE 0 END),
                    SUM(CASE WHEN u.status = :#{T(sms.swp391.models.dtos.enums.StatusEnum).BAN}     THEN 1 ELSE 0 END),
                    SUM(CASE WHEN u.status = :#{T(sms.swp391.models.dtos.enums.StatusEnum).DELETED} THEN 1 ELSE 0 END)
                )
                FROM UserEntity u
            """)
    UserDashboardStatsDTO fetchUserDashboardStats();


    List<UserEntity> findByRoleNameAndFullnameAndStatusContainingIgnoreCase(RoleEnum roleName, String fullname, StatusEnum status);
}
