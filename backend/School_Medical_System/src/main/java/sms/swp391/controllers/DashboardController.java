package sms.swp391.controllers;

import io.swagger.v3.oas.annotations.Operation;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import sms.swp391.models.dtos.responses.CampaignConsentStatisticsResponseDTO;
import sms.swp391.models.dtos.responses.DashboardOverviewDTO;
import sms.swp391.models.dtos.responses.MedicalCalendarEventDTO;
import sms.swp391.models.dtos.responses.ResponseObject;
import sms.swp391.services.DashboardService;
import sms.swp391.services.MedicalCalendarEventService;

import java.util.List;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService; private final MedicalCalendarEventService medicalCalendarEventService;
    @Operation(summary = "Lấy danh sách sự kiện y tế", description = "Lấy tất cả các sự kiện y tế đã được lưu trữ trong hệ thống.")
    @GetMapping("/calendar-events")
    public ResponseEntity<ResponseObject> getCalendarEvents() {
        List<MedicalCalendarEventDTO> events = medicalCalendarEventService.getAllMedicalCalendarEvents();
        return ResponseEntity.ok(
                ResponseObject.builder()
                        .code("FETCH_SUCCESS")
                        .message("Lấy danh sách sự kiện y tế thành công")
                        .status(HttpStatus.OK)
                        .isSuccess(true)
                        .data(events)
                        .build()
        );
    }
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
