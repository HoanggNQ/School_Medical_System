package sms.swp391.utils;

import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import sms.swp391.models.dtos.enums.RoleEnum;
import sms.swp391.models.dtos.requests.StudentImportDTO;
import sms.swp391.models.dtos.requests.UserRegisterDTO;
import sms.swp391.models.entities.MedicationEntity;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
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

}
