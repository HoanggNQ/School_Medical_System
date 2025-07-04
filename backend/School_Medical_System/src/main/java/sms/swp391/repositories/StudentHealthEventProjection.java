package sms.swp391.repositories;


import java.time.LocalDate;
public interface StudentHealthEventProjection {
    String getType();
    Long getCampaignId();
    String getCampaignName();
    Long getConsentId();
    LocalDate getStartDate();
    LocalDate getEndDate();
    String getConsentStatus();
    String getStudentName();
    String getLocation();
    String getResultStatus();
}

