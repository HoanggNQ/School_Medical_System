package sms.swp391.services.impl;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.responses.MedicalCalendarEventDTO;
import sms.swp391.repositories.HealthCheckCampaignRepository;
import sms.swp391.repositories.HealthConsultationScheduleRepository;
import sms.swp391.repositories.MedicationRequestRepository;
import sms.swp391.repositories.VaccinationCampaignRepository;
import sms.swp391.services.MedicalCalendarEventService;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class MedicalCalendarEventServiceImpl implements MedicalCalendarEventService {
    private final VaccinationCampaignRepository vaccinationRepo;
    private final HealthCheckCampaignRepository healthCheckRepo;
    private final MedicationRequestRepository medicationRepo;
    private final HealthConsultationScheduleRepository consultationRepo;

    @Override
    @Transactional(readOnly = true)
    public List<MedicalCalendarEventDTO> getAllMedicalCalendarEvents() {
        List<MedicalCalendarEventDTO> events = new ArrayList<>();

        vaccinationRepo.findAll().forEach(vc -> {
            events.add(MedicalCalendarEventDTO.builder()
                    .eventId(vc.getId())
                    .name(vc.getName())
                    .location(vc.getLocation())
                    .startDate(vc.getStartDate())
                    .endDate(vc.getEndDate())
                    .status(vc.getStatus())
                    .type("VACCINATION")
                    .build());
        });

        healthCheckRepo.findAll().forEach(hc -> {
            events.add(MedicalCalendarEventDTO.builder()
                    .eventId(hc.getId())
                    .name(hc.getName())
                    .location(hc.getLocation())
                    .startDate(hc.getStartDate())
                    .endDate(hc.getEndDate())
                    .status(hc.getStatus())
                    .type("HEALTH_CHECK")
                    .build());
        });

        medicationRepo.findAll().forEach(mr -> {
            if (mr.getMedicationRequestDetails() != null && mr.getStatus().equals(MedicalStatus.APPROVED) && !mr.getMedicationRequestDetails().isEmpty()) {
                mr.getMedicationRequestDetails().forEach(detail -> {
                    events.add(MedicalCalendarEventDTO.builder()
                            .eventId(mr.getId())
                            .name("Cho student: " + mr.getStudent().getStudentCode() + " Uống thuốc: " + detail.getMedication().getMedicationName())
                            .location("Tại trường")
                            .startDate(detail.getStartDate())
                            .endDate(detail.getEndDate())
                            .status(mr.getStatus())
                            .type("MEDICATION-REQUEST")
                            .build());
                });
            }
        });

        consultationRepo.findAll().forEach(cs -> {
            if (cs.getStudent() == null || cs.getScheduleTime() == null || !cs.getStatus().equals(MedicalStatus.PENDING))
                return; // Skip if student or schedule time is null
            events.add(MedicalCalendarEventDTO.builder()
                    .eventId(cs.getId())
                    .name("Tư vấn sức khỏe cho " + cs.getStudent().getUser().getFullname())
                    .location("Phòng y tế")
                    .startDate(cs.getScheduleTime().toLocalDate())
                    .endDate(null)
                    .status(cs.getStatus())
                    .type("CONSULTATION")
                    .build());
        });

        return events;
    }

}
