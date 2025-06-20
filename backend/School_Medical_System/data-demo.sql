
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (1, 'Phụ huynh 1', 'ph1', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'PARENT', 'ACTIVE', '0900000001');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (2, 'Phụ huynh 2', 'ph2', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'PARENT', 'ACTIVE', '0900000002');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (3, 'Phụ huynh 3', 'ph3', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'PARENT', 'ACTIVE', '0900000003');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (4, 'Phụ huynh 4', 'ph4', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'PARENT', 'ACTIVE', '0900000004');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (5, 'Phụ huynh 5', 'ph5', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'PARENT', 'ACTIVE', '0900000005');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (6, 'Học sinh 1', 'st1', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000006');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (7, 'Học sinh 2', 'st2', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000007');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (8, 'Học sinh 3', 'st3', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000008');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (9, 'Học sinh 4', 'st4', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000009');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (10, 'Học sinh 5', 'st5', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000010');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (11, 'Học sinh 6', 'st6', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000011');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (12, 'Học sinh 7', 'st7', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000012');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (13, 'Học sinh 8', 'st8', 'pass8', 'STUDENT', 'ACTIVE', '0900000013');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (14, 'Học sinh 9', 'st9', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000014');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (15, 'Học sinh 10', 'st10', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'STUDENT', 'ACTIVE', '0900000015');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (16, 'Y tá Trường', 'yta1', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'SCHOOL_NURSE', 'ACTIVE', '0900000016');
INSERT INTO public."user" (user_id, fullname, username, password, role_name, status, phone)
VALUES (17, 'Admin', 'admin', '$2a$10$6N6jvBtisKk5qwenCNVIMugJ4JzcVCQSK3GPl13oh63hBFBVwRltm', 'ADMIN', 'ACTIVE', '0900000017');


INSERT INTO public.class (class_id, grade, class_name) VALUES (1, 5, '5A');


INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (1, 'HS001', 6, 1, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (2, 'HS002', 7, 2, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (3, 'HS003', 8, 3, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (4, 'HS004', 9, 4, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (5, 'HS005', 10, 5, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (6, 'HS006', 11, 1, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (7, 'HS007', 12, 2, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (8, 'HS008', 13, 3, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (9, 'HS009', 14, 4, 1);
INSERT INTO public.student (student_id, student_code, user_id, parent_id, class_id)
VALUES (10, 'HS010', 15, 5, 1);


INSERT INTO public.health_check_campaign (health_check_campaign_id, check_date, target_grade, status, name, location)
VALUES (1, '2025-09-15', 5, 'SCHEDULED', 'Khám sức khỏe đầu năm', 'Phòng y tế trường');
INSERT INTO public.health_check_campaign (health_check_campaign_id, check_date, target_grade, status, name, location)
VALUES (2, '2026-03-15', 5, 'SCHEDULED', 'Khám sức khỏe cuối năm', 'Phòng y tế trường');


INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 1, 1, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 1, 1, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 2, 2, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 2, 2, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 3, 3, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 3, 3, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 4, 4, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 4, 4, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 5, 5, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 5, 5, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 1, 6, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 1, 6, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 2, 7, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 2, 7, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 3, 8, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 3, 8, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 4, 9, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 4, 9, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 5, 10, '2025-2026', 'APPROVED');
INSERT INTO public.health_check_consent (health_check_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 5, 10, '2025-2026', 'APPROVED');

INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 1, '2025-2026',
        143.4, 45.9, 22.3, 85, 37.0, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 1, '2025-2026',
        146.6, 42.4, 19.7, 73, 37.4, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 2, '2025-2026',
        141.0, 38.1, 19.2, 83, 37.2, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 2, '2025-2026',
        145.5, 32.9, 15.5, 87, 36.4, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 3, '2025-2026',
        137.4, 45.3, 24.0, 85, 37.1, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 3, '2025-2026',
        131.3, 31.5, 18.3, 71, 36.4, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 4, '2025-2026',
        146.4, 38.9, 18.1, 72, 37.2, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 4, '2025-2026',
        132.7, 36.6, 20.8, 71, 36.7, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 5, '2025-2026',
        146.3, 48.5, 22.7, 80, 37.4, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 5, '2025-2026',
        147.6, 37.0, 17.0, 71, 37.2, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 6, '2025-2026',
        133.4, 37.9, 21.3, 74, 36.3, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 6, '2025-2026',
        135.9, 32.8, 17.8, 89, 37.1, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 7, '2025-2026',
        133.8, 31.9, 17.8, 87, 36.9, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 7, '2025-2026',
        143.1, 43.0, 21.0, 79, 37.1, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 8, '2025-2026',
        136.1, 37.7, 20.4, 88, 36.5, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 8, '2025-2026',
        133.4, 35.3, 19.8, 90, 37.1, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 9, '2025-2026',
        137.9, 40.2, 21.1, 83, 37.4, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 9, '2025-2026',
        139.9, 41.2, 21.1, 84, 37.1, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 1, 10, '2025-2026',
        138.3, 37.8, 19.8, 90, 36.8, 'TỐT');
INSERT INTO public.health_check_result (
    check_date, checked_by, health_check_campaign_id, student_id, academic_year,
    height_cm, weight_kg, bmi, pulse, temperature, overall_health_rating)
VALUES ('2025-09-15', 16, 2, 10, '2025-2026',
        132.3, 47.4, 27.1, 84, 37.2, 'TỐT');


INSERT INTO public.vaccination_campaign (vaccination_campaign_id, start_date, end_date, target_grade, status, name, vaccine_type)
VALUES (1, '2025-10-01', '2025-10-07', 5, 'SCHEDULED', 'Tiêm Sởi', 'Sởi');
INSERT INTO public.vaccination_campaign (vaccination_campaign_id, start_date, end_date, target_grade, status, name, vaccine_type)
VALUES (2, '2026-01-05', '2026-01-10', 5, 'SCHEDULED', 'Tiêm Rubella', 'Rubella');


INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 1, 1, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 1, 1, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 2, 2, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 2, 2, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 3, 3, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 3, 3, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 4, 4, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 4, 4, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 5, 5, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 5, 5, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 1, 6, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 1, 6, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 2, 7, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 2, 7, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 3, 8, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 3, 8, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 4, 9, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 4, 9, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (1, 5, 10, '2025-2026', 'APPROVED');
INSERT INTO public.vaccination_consent (vaccination_campaign_id, parent_id, student_id, academic_year, consent_status)
VALUES (2, 5, 10, '2025-2026', 'APPROVED');


INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 1, 1, '2025-2026', 'VC0101', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 1, 2, '2025-2026', 'VC0201', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 2, 1, '2025-2026', 'VC0102', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 2, 2, '2025-2026', 'VC0202', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 3, 1, '2025-2026', 'VC0103', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 3, 2, '2025-2026', 'VC0203', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 4, 1, '2025-2026', 'VC0104', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 4, 2, '2025-2026', 'VC0204', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 5, 1, '2025-2026', 'VC0105', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 5, 2, '2025-2026', 'VC0205', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 6, 1, '2025-2026', 'VC0106', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 6, 2, '2025-2026', 'VC0206', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 7, 1, '2025-2026', 'VC0107', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 7, 2, '2025-2026', 'VC0207', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 8, 1, '2025-2026', 'VC0108', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 8, 2, '2025-2026', 'VC0208', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 9, 1, '2025-2026', 'VC0109', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 9, 2, '2025-2026', 'VC0209', 'Rubella');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 10, 1, '2025-2026', 'VC0110', 'Sởi');
INSERT INTO public.vaccination_record (
    administered_by, administration_date, student_id, vaccination_campaign_id, academic_year,
    vaccine_batch, vaccine_name)
VALUES (16, '2025-10-05 08:00:00+07', 10, 2, '2025-2026', 'VC0210', 'Rubella');


INSERT INTO public.medication (medication_id, medication_name, dosage_form, category)
VALUES (1, 'Paracetamol', 'Viên nén', 'Thông thường');
INSERT INTO public.medication (medication_id, medication_name, dosage_form, category)
VALUES (2, 'Amoxicillin', 'Viên nén', 'Thông thường');
INSERT INTO public.medication (medication_id, medication_name, dosage_form, category)
VALUES (3, 'Cotrim', 'Viên nén', 'Thông thường');
INSERT INTO public.medication (medication_id, medication_name, dosage_form, category)
VALUES (4, 'Vitamin C', 'Viên nén', 'Thông thường');


INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (1, 1, 1, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (1, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (1, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (2, 2, 2, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (2, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (2, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (3, 3, 3, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (3, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (3, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (4, 4, 4, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (4, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (4, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (5, 5, 5, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (5, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (5, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (6, 1, 6, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (6, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (6, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (7, 2, 7, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (7, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (7, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (8, 3, 8, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (8, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (8, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (9, 4, 9, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (9, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (9, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request (request_id, requested_by, student_id, academic_year, status)
VALUES (10, 5, 10, '2025-2026', 'PENDING');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (10, 1, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');
INSERT INTO public.medication_request_detail (
    request_id, medication_id, quantity, start_date, end_date, dosage, frequency)
VALUES (10, 2, 3, '2025-11-01', '2025-11-03', '1 viên', '2 lần/ngày');


SELECT setval('user_user_id_seq', (SELECT MAX(user_id) FROM public."user"));
SELECT setval('student_student_id_seq', (SELECT MAX(student_id) FROM public.student));
SELECT setval('medication_request_request_id_seq', (SELECT MAX(request_id) FROM public.medication_request));
SELECT setval('medication_medication_id_seq', (SELECT MAX(medication_id) FROM public.medication));
SELECT setval('health_check_campaign_health_check_campaign_id_seq', (SELECT MAX(health_check_campaign_id) FROM public.health_check_campaign));
SELECT setval('vaccination_campaign_vaccination_campaign_id_seq', (SELECT MAX(vaccination_campaign_id) FROM public.vaccination_campaign));
