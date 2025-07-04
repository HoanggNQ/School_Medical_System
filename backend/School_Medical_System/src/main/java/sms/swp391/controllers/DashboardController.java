package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO;
import sms.swp391.models.dtos.responses.DashboardOverviewDTO;
import sms.swp391.services.DashboardService;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    @Operation(summary = "Lấy tổng quan dashboard", description = "Trả về tổng quan dashboard bao gồm số lượng học sinh, giáo viên, lớp học và các chiến dịch.")
    @GetMapping("/overview")
    public ResponseEntity<DashboardOverviewDTO> getOverview() {
        return ResponseEntity.ok(dashboardService.getOverview());
    }
    @Operation(summary = "Lấy thống kê consent của chiến dịch khám", description = "Trả về thống kê consent của chiến dịch khám theo ID.")
    @GetMapping("/healthCheck/{id}/statistics")
    public ResponseEntity<CampaignConsentStatisticsResponseDTO> getHealthCheckCampaignStats(@PathVariable Long id) {
        return ResponseEntity.ok(dashboardService.getHealthCheckConsentStatistics(id));
    }
    @Operation(summary = "Lấy thống kê chiến dịch tiêm vaccine", description = "Trả về thống kê số lượng học sinh đã đồng ý, từ chối và đang chờ đồng ý trong chiến dịch tiêm vaccine theo ID.")
    @GetMapping("/vaccination/{id}/statistics")
    public ResponseEntity<CampaignConsentStatisticsResponseDTO> getVaccinationCampaignStats(@PathVariable Long id) {
        return ResponseEntity.ok(dashboardService.getVaccinationConsentStatistics(id));
    }
}
