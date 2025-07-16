package sms.swp391.services;

import org.springframework.transaction.annotation.Transactional;
import sms.swp391.models.dtos.requests.CreateHealthCheckResultListRequestDTO;
import sms.swp391.models.dtos.requests.HealthCheckResultRequestDTO;
import sms.swp391.models.dtos.responses.HealthCheckResultResponse;

import java.util.List;

public interface HealthCheckResultService {
    @Transactional
    List<HealthCheckResultResponse> createBulkResults(CreateHealthCheckResultListRequestDTO req,
                                                      Long checkedById);

    HealthCheckResultResponse saveResult(HealthCheckResultRequestDTO request, Long checkedById);

    HealthCheckResultResponse getResultById(Long id);

    HealthCheckResultResponse getResultByStudent_IdResutId(Long id, Long studentId);

    List<HealthCheckResultResponse> getResultsByCampaign(Long campaignId);

    List<HealthCheckResultResponse> getResultsByStudent(Long studentId);
}
