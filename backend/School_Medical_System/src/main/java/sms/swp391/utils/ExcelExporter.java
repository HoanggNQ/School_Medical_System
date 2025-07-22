package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import sms.swp391.models.dtos.enums.MedicalStatus;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.requests.HealthCheckResultRequestDTO;
import sms.swp391.models.dtos.requests.StudentImportDTO;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.dtos.requests.VaccinationRecordRequestDTO;
import sms.swp391.models.entities.HealthCheckConsentEntity;
import sms.swp391.models.entities.MedicationEntity;
import sms.swp391.models.entities.StudentEntity;
import sms.swp391.models.entities.VaccinationConsentEntity;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

import static jakarta.xml.bind.DatatypeConverter.parseDecimal;
import static jakarta.xml.bind.DatatypeConverter.parseLong;

@RequiredArgsConstructor
public class ExcelExporter {

    public static ByteArrayInputStream export(List<MedicationEntity> medications) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("Medications");

            // Header
            Row header = sheet.createRow(0);
            String[] headers = {"ID", "Name", "Category", "Dosage Form", "Prescription Required", "Country", "Manufacturer"};

            for (int i = 0; i < headers.length; i++) {
                Cell cell = header.createCell(i);
                cell.setCellValue(headers[i]);
            }

            // Data rows
            int rowIdx = 1;
            for (MedicationEntity med : medications) {
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(med.getId());
                row.createCell(1).setCellValue(med.getMedicationName());
                row.createCell(2).setCellValue(med.getCategory());
                row.createCell(3).setCellValue(med.getDosageForm());
                row.createCell(5).setCellValue(med.getCountryOfOrigin());
                row.createCell(6).setCellValue(med.getManufacturer());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public static List<StudentImportDTO> parseStudentsFromExcel(InputStream in) {
        DataFormatter fmt = new DataFormatter();
        List<StudentImportDTO> list = new ArrayList<>();

        try (Workbook wb = new XSSFWorkbook(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = 0;

            for (Row row : sheet) {
                if (rowNum++ == 0) continue;  // Bỏ qua header

                StudentImportDTO dto = new StudentImportDTO();
                dto.setEmail(fmt.formatCellValue(row.getCell(0)));
                dto.setPassword(fmt.formatCellValue(row.getCell(1)));
                dto.setUsername(fmt.formatCellValue(row.getCell(2)));
                dto.setFullname(fmt.formatCellValue(row.getCell(3)));
                dto.setAddress(fmt.formatCellValue(row.getCell(4)));
                dto.setGender(fmt.formatCellValue(row.getCell(5)));

                Cell dobCell = row.getCell(6);
                if (dobCell != null) {
                    if (dobCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(dobCell)) {
                        dto.setDob(dobCell.getLocalDateTimeCellValue().toLocalDate());
                    } else {
                        String dobStr = fmt.formatCellValue(dobCell);
                        if (!dobStr.isBlank()) {
                            dto.setDob(LocalDate.parse(dobStr));
                        }
                    }
                }

                dto.setPhoneNumber(fmt.formatCellValue(row.getCell(7)));
                dto.setClassId(parseLong(fmt.formatCellValue(row.getCell(8))));
                dto.setParentId(parseLong(fmt.formatCellValue(row.getCell(9))));
                dto.setBloodType(fmt.formatCellValue(row.getCell(10)));
                dto.setGeneticDiseases(fmt.formatCellValue(row.getCell(11)));
                dto.setChronicDiseases(fmt.formatCellValue(row.getCell(12)));
                dto.setAllergies(fmt.formatCellValue(row.getCell(13)));
                dto.setEmergencyContactName(fmt.formatCellValue(row.getCell(14)));
                dto.setEmergencyContactPhone(fmt.formatCellValue(row.getCell(15)));
                dto.setHeight(parseDecimal(fmt.formatCellValue(row.getCell(16))));
                dto.setWeight(parseDecimal(fmt.formatCellValue(row.getCell(17))));

                list.add(dto);
            }
        } catch (Exception ex) {
            throw new RuntimeException("Fail parse excel: " + ex.getMessage(), ex);
        }

        return list;
    }

    public static List<UserRegisterDTO> parseUsersFromExcel(InputStream in) {
        DataFormatter fmt = new DataFormatter();
        List<UserRegisterDTO> list = new ArrayList<>();

        try (Workbook wb = new XSSFWorkbook(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = 0;

            for (Row row : sheet) {
                if (rowNum++ == 0) continue;      // skip header

                UserRegisterDTO dto = new UserRegisterDTO();
                dto.setEmail(fmt.formatCellValue(row.getCell(0)));
                dto.setPassword(fmt.formatCellValue(row.getCell(1)));
                dto.setUsername(fmt.formatCellValue(row.getCell(2)));
                dto.setFullName(fmt.formatCellValue(row.getCell(3)));
                dto.setAddress(fmt.formatCellValue(row.getCell(4)));
                dto.setGender(fmt.formatCellValue(row.getCell(5)));

                Cell dobCell = row.getCell(6);
                if (dobCell != null) {
                    if (dobCell.getCellType() == CellType.NUMERIC && DateUtil.isCellDateFormatted(dobCell)) {
                        dto.setDob(dobCell.getLocalDateTimeCellValue().toLocalDate());
                    } else {
                        String dobStr = fmt.formatCellValue(dobCell);
                        if (!dobStr.isBlank()) dto.setDob(LocalDate.parse(dobStr));
                    }
                }

                dto.setPhoneNumber(fmt.formatCellValue(row.getCell(7)));

                String rawRole = fmt.formatCellValue(row.getCell(8)).trim().toUpperCase();
                try {
                    dto.setRoleName(RoleEnum.valueOf(rawRole));
                } catch (IllegalArgumentException ex) {
                    throw new IllegalArgumentException(
                            "Invalid role '" + rawRole + "' at row " + rowNum +
                                    ". Allowed: SCHOOL_NURSE, PARENT");
                }

                list.add(dto);
            }
        } catch (Exception ex) {
            throw new RuntimeException("Fail parse excel: " + ex.getMessage(), ex);
        }
        return list;
    }

    private static Long parseLongSafe(String value) {
        try {
            return (value == null || value.isBlank()) ? null : Long.parseLong(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static Double parseDecimalSafe(String value) {
        try {
            return (value == null || value.isBlank()) ? null :  Double.parseDouble(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    private static Integer parseIntSafe(String value) {
        try {
            return (value == null || value.isBlank()) ? null : Integer.parseInt(value.trim());
        } catch (NumberFormatException e) {
            return null;
        }
    }

    public static List<HealthCheckResultRequestDTO> parseHealthCheckResultsFromExcel(InputStream in) {
        DataFormatter fmt = new DataFormatter();
        List<HealthCheckResultRequestDTO> list = new ArrayList<>();

        try (Workbook wb = new XSSFWorkbook(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = 0;

            for (Row row : sheet) {
                rowNum++;
                if (rowNum == 1) continue;  // skip header

                try {
                    HealthCheckResultRequestDTO dto = new HealthCheckResultRequestDTO();

                    dto.setCampaignId(parseLongSafe(fmt.formatCellValue(row.getCell(0))));
                    dto.setStudentId(parseLongSafe(fmt.formatCellValue(row.getCell(1))));
                    dto.setHeightCm(parseDecimalSafe(fmt.formatCellValue(row.getCell(4))));// Skip 2 columns: studentName (2), className (3)
                    dto.setWeightKg(parseDecimalSafe(fmt.formatCellValue(row.getCell(5))));
                    dto.setVisionLeft(fmt.formatCellValue(row.getCell(6)));
                    dto.setVisionRight(fmt.formatCellValue(row.getCell(7)));
                    dto.setHearing(fmt.formatCellValue(row.getCell(8)));
                    dto.setDentalHealth(fmt.formatCellValue(row.getCell(9)));
                    dto.setBloodPressure(fmt.formatCellValue(row.getCell(10)));
                    dto.setPulse(parseIntSafe(fmt.formatCellValue(row.getCell(11))));
                    dto.setTemperature(parseDecimalSafe(fmt.formatCellValue(row.getCell(12))));
                    dto.setOtherNotes(fmt.formatCellValue(row.getCell(13)));
                    dto.setRecommendation(fmt.formatCellValue(row.getCell(14)));
                    dto.setFollowUpNotes(fmt.formatCellValue(row.getCell(15)));
                    dto.setOverallHealthRating(fmt.formatCellValue(row.getCell(16)));


                    list.add(dto);
                } catch (Exception e) {
                    throw new RuntimeException("Lỗi tại dòng " + rowNum + ": " + e.getMessage(), e);
                }
            }
        } catch (Exception ex) {
            throw new RuntimeException("Lỗi khi đọc file Excel kết quả khám sức khỏe: " + ex.getMessage(), ex);
        }

        return list;
    }

    public static ByteArrayInputStream exportEligibleStudentsForResult(List<HealthCheckConsentEntity> consents) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("EligibleHealthCheck");

            String[] headers = {
                    "campaignId", "studentId", "studentName", "className",
                    "heightCm", "weightKg", "visionLeft", "visionRight",
                    "hearing", "dentalHealth", "bloodPressure", "pulse", "temperature",
                    "otherNotes", "recommendation", "followUpNotes", "overallHealthRating"
            };

            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                headerRow.createCell(i).setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (HealthCheckConsentEntity consent : consents) {
                StudentEntity student = consent.getStudent();
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(consent.getHealthCheckCampaign().getId());
                row.createCell(1).setCellValue(student.getId());
                row.createCell(2).setCellValue(student.getUser().getFullname());
                row.createCell(3).setCellValue(student.getClassEntity().getClassName());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public static ByteArrayInputStream exportEligibleStudentsForVaccination(List<VaccinationConsentEntity> consents) throws IOException {
        try (Workbook workbook = new XSSFWorkbook(); ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            Sheet sheet = workbook.createSheet("EligibleVaccination");

            String[] headers = {
                    "campaignId", "studentId", "studentName", "className","vaccineName",
                    "injectionSite", "reactionNotes", "followUpNotes"
            };

            // Create header row
            Row headerRow = sheet.createRow(0);
            for (int i = 0; i < headers.length; i++) {
                Cell cell = headerRow.createCell(i);
                cell.setCellValue(headers[i]);
            }

            int rowIdx = 1;
            for (VaccinationConsentEntity consent : consents) {
                if (consent.getConsentStatus() != MedicalStatus.APPROVED) continue;

                StudentEntity student = consent.getStudent();
                Row row = sheet.createRow(rowIdx++);

                row.createCell(0).setCellValue(consent.getVaccinationCampaign().getId());
                row.createCell(1).setCellValue(student.getId());
                row.createCell(2).setCellValue(student.getUser().getFullname());
                row.createCell(3).setCellValue(student.getClassEntity().getClassName());

                // Empty columns for user input
                row.createCell(4).setCellValue(consent.getVaccinationCampaign().getVaccineType()); // vaccineName
                row.createCell(5).setCellValue(""); // injectionSite
                row.createCell(6).setCellValue(""); // reactionNotes
                row.createCell(7).setCellValue(""); // followUpNotes


            }

            // Auto-size all columns
            for (int i = 0; i < headers.length; i++) {
                sheet.autoSizeColumn(i);
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }

    public static List<VaccinationRecordRequestDTO> parseVaccinationRecordsFromExcel(InputStream in) {
        DataFormatter fmt = new DataFormatter();
        List<VaccinationRecordRequestDTO> list = new ArrayList<>();

        try (Workbook wb = new XSSFWorkbook(in)) {
            Sheet sheet = wb.getSheetAt(0);
            int rowNum = 0;

            for (Row row : sheet) {
                if (rowNum++ == 0) continue;  // Skip header

                VaccinationRecordRequestDTO dto = new VaccinationRecordRequestDTO();

                dto.setCampaignId(parseLongSafe(fmt.formatCellValue(row.getCell(0))));
                dto.setStudentId(parseLongSafe(fmt.formatCellValue(row.getCell(1))));
                dto.setInjectionSite(fmt.formatCellValue(row.getCell(4)));
                dto.setVaccineName(fmt.formatCellValue(row.getCell(5)));
                dto.setReactionNotes(fmt.formatCellValue(row.getCell(6)));
                dto.setFollowUpNotes(fmt.formatCellValue(row.getCell(7)));

                list.add(dto);
            }

        } catch (Exception ex) {
            throw new RuntimeException("Failed to parse vaccination Excel file: " + ex.getMessage(), ex);
        }

        return list;
    }



}
