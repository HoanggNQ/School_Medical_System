package sms.swp391.repositories;

import java.time.LocalDate;

public interface StudentHealthEventProjection {
    String getType();               // "HEALTH_CHECK" / "VACCINATION"
    Long getEventId();
    String getCampaign();           // Tên chiến dịch
    String getDescription();        // Mô tả
    LocalDate getCheckDate();       // Ngày khám / tiêm
    String getStudentName();
    String getLocation();
    String getRequirementEquipment();
    String getConsentStatus();
    String getStatus();             // Optional: Đã kết thúc / Đang chờ / Đã có kết quả
}
