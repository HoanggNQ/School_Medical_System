package sms.swp391.utils;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import sms.swp391.models.entities.MedicationEntity;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.util.List;

public class MedicationExcelExporter {

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
                row.createCell(4).setCellValue(med.getPrescriptionRequired() ? "Yes" : "No");
                row.createCell(5).setCellValue(med.getCountryOfOrigin());
                row.createCell(6).setCellValue(med.getManufacturer());
            }

            workbook.write(out);
            return new ByteArrayInputStream(out.toByteArray());
        }
    }
}
