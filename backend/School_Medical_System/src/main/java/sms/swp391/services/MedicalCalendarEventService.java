package sms.swp391.services;

import sms.swp391.models.dtos.responses.MedicalCalendarEventDTO;

import java.util.List;

public interface MedicalCalendarEventService {
    List<MedicalCalendarEventDTO> getAllMedicalCalendarEvents();
}
