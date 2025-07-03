package sms.swp391.services;

import sms.swp391.models.dtos.requests.HealthCheckResultRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckResultResponse;

import java.util.List;

public interface HealthCheckResultService {

    HealthCheckResultResponse saveResult(HealthCheckResultRequestDTO request, Long checkedById);

    HealthCheckResultResponse getResultById(Long id);

    List<HealthCheckResultResponse> getResultsByCampaign(Long campaignId);

    List<HealthCheckResultResponse> getResultsByStudent(Long studentId);
}
