package sms.swp391.services.impl;

import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
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
                    .startDate(vc.getStartDate())
                    .endDate(vc.getEndDate())
                    .type("VACCINATION")
                    .build());
        });

        healthCheckRepo.findAll().forEach(hc -> {
            events.add(MedicalCalendarEventDTO.builder()
                    .startDate(hc.getStartDate())
                    .endDate(hc.getEndDate())
                    .type("HEALTH_CHECK")
                    .build());
        });

        medicationRepo.findAll().forEach(mr -> {
            // Nếu không có medication details thì bỏ qua
            if (mr.getMedicationRequestDetails() != null && !mr.getMedicationRequestDetails().isEmpty()) {
                mr.getMedicationRequestDetails().forEach(detail -> {
                    events.add(MedicalCalendarEventDTO.builder()
                            .startDate(detail.getStartDate())
                            .endDate(detail.getEndDate())
                            .type("MEDICATION-REQUEST")
                            .build());
                });
            }
        });

        consultationRepo.findAll().forEach(cs -> {
            events.add(MedicalCalendarEventDTO.builder()
                    .startDate(cs.getScheduleTime().toLocalDate())
                    .endDate(null) // chỉ 1 ngày
                    .type("CONSULTATION")
                    .build());
        });

        return events;
    }
}
