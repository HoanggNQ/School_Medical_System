package sms.swp391.services;

import sms.swp391.models.dtos.requests.HealthDeclarationRequestDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationReviewDTO;
import sms.swp391.models.dtos.requests.HealthDeclarationUpdateDTO;
import sms.swp391.models.dtos.respones.HealthDeclarationResponseDTO;

import java.util.List;

public interface HealthDeclarationService {
    HealthDeclarationResponseDTO createHealthDeclaration(Long parentId, HealthDeclarationRequestDTO request);
    HealthDeclarationResponseDTO updateHealthDeclaration(Long parentId, Long declarationId, HealthDeclarationUpdateDTO request);
    List<HealthDeclarationResponseDTO> getHealthDeclarationsByStudent(Long studentId);
    List<HealthDeclarationResponseDTO> getHealthDeclarationsByParent(Long parentId);
    HealthDeclarationResponseDTO getHealthDeclarationById(Long declarationId);
    void deleteHealthDeclaration(Long parentId, Long declarationId);
    HealthDeclarationResponseDTO reviewHealthDeclaration(Long reviewerId, Long declarationId, HealthDeclarationReviewDTO reviewDto);
    List<HealthDeclarationResponseDTO> getHealthDeclarationsByStatus(String status);
    List<HealthDeclarationResponseDTO> getListHealthDeclarations();
}