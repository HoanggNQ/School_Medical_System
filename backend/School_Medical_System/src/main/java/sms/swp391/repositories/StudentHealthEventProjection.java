package sms.swp391.repositories;

import org.springframework.beans.factory.annotation.Value;

import java.time.LocalDate;

public interface StudentHealthEventProjection {
    String getType();               // "HEALTH_CHECK" / "VACCINATION"
    Long getEventId();
    Long getConsentId();
    String getCampaign();           // Tên chiến dịch
    String getDescription();        // Mô tả
    LocalDate getCheckDate();       // Ngày khám / tiêm
    String getStudentName();
    String getLocation();
    String getRequirementEquipment();
    String getConsentStatus();
    @Value("#{target.result_status}")
    String getStatus();             // Optional: Đã kết thúc / Đang chờ / Đã có kết quả
}
