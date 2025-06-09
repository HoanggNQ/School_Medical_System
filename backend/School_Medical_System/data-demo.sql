--
-- PostgreSQL database dump
--

-- Dumped from database version 16.1
-- Dumped by pg_dump version 16.1

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: class; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.class (grade, totalstudent, class_id, class_name) VALUES (6, 35, 17, '6A1');
INSERT INTO public.class (grade, totalstudent, class_id, class_name) VALUES (6, 32, 18, '6A2');
INSERT INTO public.class (grade, totalstudent, class_id, class_name) VALUES (7, 38, 19, '7A1');
INSERT INTO public.class (grade, totalstudent, class_id, class_name) VALUES (7, 34, 20, '7A2');
INSERT INTO public.class (grade, totalstudent, class_id, class_name) VALUES (8, 36, 21, '8A1');
INSERT INTO public.class (grade, totalstudent, class_id, class_name) VALUES (8, 33, 22, '8A2');
INSERT INTO public.class (grade, totalstudent, class_id, class_name) VALUES (9, 37, 23, '9A1');
INSERT INTO public.class (grade, totalstudent, class_id, class_name) VALUES (9, 35, 24, '9A2');


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('1980-05-15', 72, 'MALE', '0901234567', '123 Đường Lý Thường Kiệt, Quận 1, TP.HCM', 'admin@school.edu.vn', 'Nguyễn Văn Admin', 'ADMIN', 'ACTIVE', 'admin', 'https://example.com/avatar1.jpg', 'hashed_password_1');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('1985-08-20', 73, 'FEMALE', '0912345674', '456 Đường Nguyễn Huệ, Quận 1, TP.HCM', 'nurse1@school.edu.vn', 'Trần Thị Hoa', 'SCHOOL_NURSE', 'ACTIVE', 'nurse_hoa', 'https://example.com/avatar2.jpg', 'hashed_password_2');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('1982-12-10', 74, 'MALE', '0923456782', '789 Đường Điện Biên Phủ, Quận 3, TP.HCM', 'nurse2@school.edu.vn', 'Lê Văn Minh', 'SCHOOL_NURSE', 'ACTIVE', 'nurse_minh', 'https://example.com/avatar3.jpg', 'hashed_password_3');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('1975-03-12', 75, 'MALE', '0934567890', '101 Đường Võ Văn Tần, Quận 3, TP.HCM', 'pham.tam@gmail.com', 'Phạm Văn Tâm', 'PARENT', 'ACTIVE', 'pham_tam', 'https://example.com/avatar4.jpg', 'hashed_password_4');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('1978-07-25', 76, 'FEMALE', '0945678901', '202 Đường Hai Bà Trưng, Quận 1, TP.HCM', 'nguyen.lan@gmail.com', 'Nguyễn Thị Lan', 'PARENT', 'ACTIVE', 'nguyen_lan', 'https://example.com/avatar5.jpg', 'hashed_password_5');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('1976-11-08', 77, 'MALE', '0956789012', '303 Đường Lê Lợi, Quận 1, TP.HCM', 'tran.hung@gmail.com', 'Trần Văn Hùng', 'PARENT', 'ACTIVE', 'tran_hung', 'https://example.com/avatar6.jpg', 'hashed_password_6');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('1979-04-18', 78, 'FEMALE', '0967890123', '404 Đường Pasteur, Quận 1, TP.HCM', 'le.mai@gmail.com', 'Lê Thị Mai', 'PARENT', 'ACTIVE', 'le_mai', 'https://example.com/avatar7.jpg', 'hashed_password_7');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('1977-09-30', 79, 'MALE', '0978901234', '505 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM', 'hoang.duc@gmail.com', 'Hoàng Văn Đức', 'PARENT', 'ACTIVE', 'hoang_duc', 'https://example.com/avatar8.jpg', 'hashed_password_8');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('2010-01-15', 80, 'MALE', '0989012345', '101 Đường Võ Văn Tần, Quận 3, TP.HCM', 'pham.an@student.edu.vn', 'Phạm Minh An', 'STUDENT', 'ACTIVE', 'pham_an', 'https://example.com/avatar9.jpg', 'hashed_password_9');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('2009-06-20', 81, 'FEMALE', '0990123456', '202 Đường Hai Bà Trưng, Quận 1, TP.HCM', 'nguyen.binh@student.edu.vn', 'Nguyễn Thị Bình', 'STUDENT', 'ACTIVE', 'nguyen_binh', 'https://example.com/avatar10.jpg', 'hashed_password_10');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('2008-11-10', 82, 'MALE', '0901235567', '303 Đường Lê Lợi, Quận 1, TP.HCM', 'tran.cuong@student.edu.vn', 'Trần Văn Cường', 'STUDENT', 'ACTIVE', 'tran_cuong', 'https://example.com/avatar11.jpg', 'hashed_password_11');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('2007-04-25', 83, 'FEMALE', '0912345678', '404 Đường Pasteur, Quận 1, TP.HCM', 'le.dung@student.edu.vn', 'Lê Thị Dung', 'STUDENT', 'ACTIVE', 'le_dung', 'https://example.com/avatar12.jpg', 'hashed_password_12');
INSERT INTO public."user" (dob, user_id, gender, phone, address, email, fullname, role_name, status, username, avatarurl, password) VALUES ('2006-08-12', 84, 'MALE', '0923456789', '505 Đường Cách Mạng Tháng 8, Quận 3, TP.HCM', 'hoang.em@student.edu.vn', 'Hoàng Văn Em', 'STUDENT', 'ACTIVE', 'hoang_em', 'https://example.com/avatar13.jpg', 'hashed_password_13');


--
-- Data for Name: health_check_campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.health_check_campaign (check_date, target_grade, created_at, created_by, health_check_campaign_id, status, location, name, description, required_equipment) VALUES ('2024-09-15', NULL, '2025-06-07 21:56:47.303365+07', 72, 4, 'COMPLETED', 'Phòng y tế trường', 'Khám sức khỏe định kỳ học kỳ 1', 'Khám sức khỏe định kỳ cho tất cả học sinh', 'Cân, thước đo chiều cao, máy đo huyết áp, đèn pin');
INSERT INTO public.health_check_campaign (check_date, target_grade, created_at, created_by, health_check_campaign_id, status, location, name, description, required_equipment) VALUES ('2024-10-20', 6, '2025-06-07 21:56:47.303365+07', 72, 5, 'ACTIVE', 'Phòng y tế trường', 'Khám sức khỏe chuyên sâu lớp 6', 'Khám sức khỏe chuyên sâu cho học sinh lớp 6', 'Thiết bị đo thị lực, máy đo thính lực, thiết bị nha khoa');
INSERT INTO public.health_check_campaign (check_date, target_grade, created_at, created_by, health_check_campaign_id, status, location, name, description, required_equipment) VALUES ('2024-11-25', NULL, '2025-06-07 21:56:47.303365+07', 72, 6, 'PLANNED', 'Phòng y tế trường', 'Sàng lọc dinh dưỡng học sinh', 'Đánh giá tình trạng dinh dưỡng học sinh', 'Cân điện tử, thước đo chiều cao, thước đo vòng eo');


--
-- Data for Name: student; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.student (class_id, created_at, parent_id, student_id, updated_at, user_id, blood_type, student_code, genetic_diseases, other_medical_notes, emergency_contact) VALUES (17, '2025-06-07 21:47:16.165814+07', 79, 41, '2025-06-07 21:47:16.165814+07', 80, 'A+', 'HS001', 'Không có', 'Dị ứng với thuốc penicillin', '{"name": "Phạm Văn Tâm", "phone": "0934567890", "relationship": "Cha"}');
INSERT INTO public.student (class_id, created_at, parent_id, student_id, updated_at, user_id, blood_type, student_code, genetic_diseases, other_medical_notes, emergency_contact) VALUES (21, '2025-06-07 21:47:16.165814+07', 75, 42, '2025-06-07 21:47:16.165814+07', 81, 'B+', 'HS002', 'Không có', 'Cận thị nhẹ', '{"name": "Nguyễn Thị Lan", "phone": "0945678901", "relationship": "Mẹ"}');
INSERT INTO public.student (class_id, created_at, parent_id, student_id, updated_at, user_id, blood_type, student_code, genetic_diseases, other_medical_notes, emergency_contact) VALUES (23, '2025-06-07 21:47:16.165814+07', 76, 43, '2025-06-07 21:47:16.165814+07', 84, 'O+', 'HS003', 'Astma di truyền', 'Cần theo dõi hô hấp', '{"name": "Trần Văn Hùng", "phone": "0956789012", "relationship": "Cha"}');
INSERT INTO public.student (class_id, created_at, parent_id, student_id, updated_at, user_id, blood_type, student_code, genetic_diseases, other_medical_notes, emergency_contact) VALUES (24, '2025-06-07 21:47:16.165814+07', 77, 44, '2025-06-07 21:47:16.165814+07', 82, 'AB+', 'HS004', 'Không có', 'Phát triển bình thường', '{"name": "Lê Thị Mai", "phone": "0967890123", "relationship": "Mẹ"}');
INSERT INTO public.student (class_id, created_at, parent_id, student_id, updated_at, user_id, blood_type, student_code, genetic_diseases, other_medical_notes, emergency_contact) VALUES (20, '2025-06-07 21:47:16.165814+07', 78, 45, '2025-06-07 21:47:16.165814+07', 83, 'A-', 'HS005', 'Không có', 'Dị ứng với hải sản', '{"name": "Hoàng Văn Đức", "phone": "0978901234", "relationship": "Cha"}');


--
-- Data for Name: health_check_consent; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.health_check_consent (consent_id, health_check_campaign_id, parent_id, response_date, student_id, academic_year, consent_status, status, notes, special_requests) VALUES (1, 4, 75, '2024-09-10 08:30:00+07', 41, '2024-2025', 'APPROVED', 'COMPLETED', 'Đồng ý khám sức khỏe', 'Lưu ý dị ứng penicillin');
INSERT INTO public.health_check_consent (consent_id, health_check_campaign_id, parent_id, response_date, student_id, academic_year, consent_status, status, notes, special_requests) VALUES (2, 5, 76, '2024-09-11 10:15:00+07', 42, '2024-2025', 'APPROVED', 'COMPLETED', 'Đồng ý khám sức khỏe', 'Có tiền sử cận thị');
INSERT INTO public.health_check_consent (consent_id, health_check_campaign_id, parent_id, response_date, student_id, academic_year, consent_status, status, notes, special_requests) VALUES (3, 4, 77, '2024-10-15 14:20:00+07', 43, '2024-2025', 'APPROVED', 'PENDING', 'Đồng ý khám chuyên sâu', 'Quan tâm đặc biệt đến tình trạng dị ứng');
INSERT INTO public.health_check_consent (consent_id, health_check_campaign_id, parent_id, response_date, student_id, academic_year, consent_status, status, notes, special_requests) VALUES (4, 6, 78, '2024-10-16 16:45:00+07', 45, '2024-2025', 'APPROVED', 'PENDING', 'Đồng ý khám chuyên sâu', 'Kiểm tra mắt kỹ lưỡng');


--
-- Data for Name: health_check_result; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.health_check_result (bmi, follow_up_required, height_cm, pulse, temperature, weight_kg, check_date, checked_by, health_check_campaign_id, result_id, student_id, academic_year, vision_left, vision_right, blood_pressure, overall_health_rating, dental_health, follow_up_notes, hearing, other_notes, recommendation) VALUES (18.10, false, 145.50, 82, 36.5, 38.20, '2024-09-15 09:00:00+07', 73, 4, 4, 41, '2024-2025', '10/10', '10/10', '110/70', 'GOOD', 'Tốt, không có sâu răng', NULL, 'Bình thường', 'Phát triển bình thường theo độ tuổi', 'Duy trì chế độ ăn uống và tập luyện');
INSERT INTO public.health_check_result (bmi, follow_up_required, height_cm, pulse, temperature, weight_kg, check_date, checked_by, health_check_campaign_id, result_id, student_id, academic_year, vision_left, vision_right, blood_pressure, overall_health_rating, dental_health, follow_up_notes, hearing, other_notes, recommendation) VALUES (17.80, true, 142.00, 78, 36.2, 35.80, '2024-09-15 09:30:00+07', 74, 5, 5, 42, '2024-2025', '8/10', '7/10', '105/65', 'FAIR', 'Có 1 răng sâu nhẹ', 'Hẹn tái khám mắt sau 3 tháng', 'Bình thường', 'Cận thị nhẹ, cần theo dõi', 'Cần khám mắt chuyên khoa, điều trị sâu răng');
INSERT INTO public.health_check_result (bmi, follow_up_required, height_cm, pulse, temperature, weight_kg, check_date, checked_by, health_check_campaign_id, result_id, student_id, academic_year, vision_left, vision_right, blood_pressure, overall_health_rating, dental_health, follow_up_notes, hearing, other_notes, recommendation) VALUES (18.90, false, 155.20, 88, 36.8, 45.60, '2024-09-15 10:00:00+07', 73, 6, 6, 43, '2024-2025', '10/10', '10/10', '115/75', 'GOOD', 'Tốt', NULL, 'Bình thường', 'Sức khỏe tốt, phát triển đúng độ tuổi', 'Duy trì hoạt động thể thao');


--
-- Data for Name: health_declaration; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.health_declaration (declaration_date, declaration_id, declared_by, reviewed_by, reviewed_date, student_id, academic_year, status) VALUES ('2024-09-01 10:00:00+07', 5, 79, 73, '2024-09-02 14:30:00+07', 41, '2024-2025', 'APPROVED');
INSERT INTO public.health_declaration (declaration_date, declaration_id, declared_by, reviewed_by, reviewed_date, student_id, academic_year, status) VALUES ('2024-09-01 11:30:00+07', 6, 75, 73, '2024-09-02 15:00:00+07', 42, '2024-2025', 'APPROVED');
INSERT INTO public.health_declaration (declaration_date, declaration_id, declared_by, reviewed_by, reviewed_date, student_id, academic_year, status) VALUES ('2024-09-01 14:15:00+07', 7, 76, NULL, NULL, 43, '2024-2025', 'PENDING');
INSERT INTO public.health_declaration (declaration_date, declaration_id, declared_by, reviewed_by, reviewed_date, student_id, academic_year, status) VALUES ('2024-09-02 09:45:00+07', 8, 77, 74, '2024-09-03 10:20:00+07', 44, '2024-2025', 'APPROVED');


--
-- Data for Name: health_declaration_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.health_declaration_detail (created_at, declaration_id, detail_id, severity, category, additional_info, description) VALUES ('2025-06-07 22:11:49.733952+07', 5, 1, 'HIGH', 'Dị ứng', '{"trigger": "penicillin", "symptoms": ["phát ban", "ngứa"]}', 'Dị ứng với thuốc penicillin');
INSERT INTO public.health_declaration_detail (created_at, declaration_id, detail_id, severity, category, additional_info, description) VALUES ('2025-06-07 22:11:49.733952+07', 6, 2, 'LOW', 'Thị lực', '{"degree": "-0.5D", "needs_glasses": true}', 'Cận thị nhẹ');
INSERT INTO public.health_declaration_detail (created_at, declaration_id, detail_id, severity, category, additional_info, description) VALUES ('2025-06-07 22:11:49.733952+07', 7, 3, 'MEDIUM', 'Hô hấp', '{"triggers": ["bụi", "phấn hoa"], "frequency": "thỉnh thoảng"}', 'Hen suyễn');
INSERT INTO public.health_declaration_detail (created_at, declaration_id, detail_id, severity, category, additional_info, description) VALUES ('2025-06-07 22:11:49.733952+07', 8, 4, 'MEDIUM', 'Tiêu hóa', '{"symptoms": ["nôn", "tiêu chảy"], "allergens": ["hải sản", "đậu phộng"]}', 'Dị ứng thức ăn');


--
-- Data for Name: medication; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.medication (prescription_required, created_at, medication_id, updated_at, country_of_origin, dosage_form, active_ingredient, category, description, manufacturer, medication_name, medication_img, medication_information) VALUES (false, '2025-06-07 21:43:58.466719+07', 1, '2025-06-07 21:43:58.466719+07', 'Việt Nam', 'Viên nén', 'Paracetamol', 'Giảm đau, hạ sốt', 'Thuốc giảm đau, hạ sốt thông dụng', 'Dược phẩm ABC', 'Paracetamol 500mg', NULL, 'Liều dùng: 1-2 viên/lần, 3-4 lần/ngày. Không quá 8 viên/ngày.');
INSERT INTO public.medication (prescription_required, created_at, medication_id, updated_at, country_of_origin, dosage_form, active_ingredient, category, description, manufacturer, medication_name, medication_img, medication_information) VALUES (true, '2025-06-07 21:43:58.466719+07', 2, '2025-06-07 21:43:58.466719+07', 'Việt Nam', 'Viên nang', 'Amoxicillin', 'Kháng sinh', 'Kháng sinh phổ rộng', 'Dược phẩm XYZ', 'Amoxicillin 250mg', NULL, 'Liều dùng: 1 viên/lần, 3 lần/ngày. Uống trước ăn 30 phút.');
INSERT INTO public.medication (prescription_required, created_at, medication_id, updated_at, country_of_origin, dosage_form, active_ingredient, category, description, manufacturer, medication_name, medication_img, medication_information) VALUES (true, '2025-06-07 21:43:58.466719+07', 3, '2025-06-07 21:43:58.466719+07', 'Ấn Độ', 'Xịt hít', 'Salbutamol', 'Thuốc hen suyễn', 'Thuốc giãn phế quản', 'Pharma DEF', 'Salbutamol 100mcg', NULL, 'Liều dùng: 1-2 nhát xịt khi cần thiết. Không quá 8 nhát/ngày.');
INSERT INTO public.medication (prescription_required, created_at, medication_id, updated_at, country_of_origin, dosage_form, active_ingredient, category, description, manufacturer, medication_name, medication_img, medication_information) VALUES (false, '2025-06-07 21:43:58.466719+07', 4, '2025-06-07 21:43:58.466719+07', 'Việt Nam', 'Viên nén', 'Loratadine', 'Thuốc chống dị ứng', 'Thuốc chống dị ứng', 'Dược phẩm GHI', 'Loratadine 10mg', NULL, 'Liều dùng: 1 viên/ngày, uống vào buổi tối.');
INSERT INTO public.medication (prescription_required, created_at, medication_id, updated_at, country_of_origin, dosage_form, active_ingredient, category, description, manufacturer, medication_name, medication_img, medication_information) VALUES (false, '2025-06-07 21:43:58.466719+07', 5, '2025-06-07 21:43:58.466719+07', 'Việt Nam', 'Viên sủi', 'Acid ascorbic', 'Vitamin', 'Bổ sung vitamin C', 'Dược phẩm JKL', 'Vitamin C 500mg', NULL, 'Liều dùng: 1 viên/ngày, pha với nước.');


--
-- Data for Name: medication_request; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.medication_request (request_date, request_id, requested_by, review_date, reviewed_by, student_id, academic_year, priority, status, notes) VALUES ('2024-09-20 08:30:00+07', 5, 78, '2024-09-20 10:15:00+07', 73, 41, '2024-2025', 'MEDIUM', 'APPROVED', 'Học sinh bị sốt nhẹ');
INSERT INTO public.medication_request (request_date, request_id, requested_by, review_date, reviewed_by, student_id, academic_year, priority, status, notes) VALUES ('2024-09-25 14:20:00+07', 6, 75, '2024-09-25 16:30:00+07', 73, 42, '2024-2025', 'LOW', 'APPROVED', 'Thuốc bổ sung vitamin');
INSERT INTO public.medication_request (request_date, request_id, requested_by, review_date, reviewed_by, student_id, academic_year, priority, status, notes) VALUES ('2024-10-01 09:45:00+07', 7, 76, NULL, NULL, 43, '2024-2025', 'HIGH', 'PENDING', 'Cơn hen suyễn');
INSERT INTO public.medication_request (request_date, request_id, requested_by, review_date, reviewed_by, student_id, academic_year, priority, status, notes) VALUES ('2024-10-05 11:00:00+07', 8, 77, '2024-10-05 13:20:00+07', 74, 44, '2024-2025', 'LOW', 'APPROVED', 'Dị ứng mùa');


--
-- Data for Name: medication_request_detail; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.medication_request_detail (end_date, quantity, start_date, detail_id, medication_id, request_id, status, actual_administration, administration_time, attachment_url, dosage, frequency) VALUES ('2024-09-22', 6, '2024-09-20', 1, 1, 5, 'COMPLETED', '{"2024-09-20": ["08:00", "14:00", "20:00"], "2024-09-21": ["08:00", "14:00", "20:00"]}', '{08:00:00,14:00:00,20:00:00}', NULL, '500mg', '3 lần/ngày');
INSERT INTO public.medication_request_detail (end_date, quantity, start_date, detail_id, medication_id, request_id, status, actual_administration, administration_time, attachment_url, dosage, frequency) VALUES ('2024-10-25', 30, '2024-09-25', 2, 5, 6, 'ACTIVE', '{"2024-09-25": ["08:00"], "2024-09-26": ["08:00"]}', '{08:00:00}', NULL, '500mg', '1 lần/ngày');
INSERT INTO public.medication_request_detail (end_date, quantity, start_date, detail_id, medication_id, request_id, status, actual_administration, administration_time, attachment_url, dosage, frequency) VALUES ('2024-10-31', 1, '2024-10-01', 3, 3, 7, 'PENDING', NULL, '{}', 'https://example.com/prescription1.pdf', '100mcg', 'Khi cần');
INSERT INTO public.medication_request_detail (end_date, quantity, start_date, detail_id, medication_id, request_id, status, actual_administration, administration_time, attachment_url, dosage, frequency) VALUES ('2024-10-12', 7, '2024-10-05', 4, 4, 8, 'ACTIVE', '{"2024-10-05": ["20:00"]}', '{20:00:00}', NULL, '10mg', '1 lần/ngày');


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.notifications (date_create, notification_id, user_id, content, status, title) VALUES ('2024-09-16', 6, 74, 'Kết quả khám sức khỏe của con bạn đã có. Vui lòng kiểm tra chi tiết.', 'ACTIVE', 'Kết quả khám sức khỏe');
INSERT INTO public.notifications (date_create, notification_id, user_id, content, status, title) VALUES ('2024-09-25', 7, 75, 'Chiến dịch tiêm chủng cúm mùa sẽ bắt đầu vào ngày 01/10/2024. Vui lòng chuẩn bị.', 'ACTIVE', 'Lịch tiêm chủng');
INSERT INTO public.notifications (date_create, notification_id, user_id, content, status, title) VALUES ('2024-10-01', 8, 76, 'Yêu cầu thuốc hen suyễn cho con bạn đang được xem xét. Vui lòng đợi thông báo.', 'ACTIVE', 'Yêu cầu thuốc được duyệt');
INSERT INTO public.notifications (date_create, notification_id, user_id, content, status, title) VALUES ('2024-10-05', 9, 77, 'Đã đến giờ uống thuốc chống dị ứng. Vui lòng nhắc nhở con em.', 'ACTIVE', 'Nhắc nhở uống thuốc');
INSERT INTO public.notifications (date_create, notification_id, user_id, content, status, title) VALUES ('2024-10-01', 10, 72, 'Báo cáo sức khỏe học sinh tháng 9 đã sẵn sàng. Vui lòng xem xét.', 'ACTIVE', 'Báo cáo hàng tháng');


--
-- Data for Name: vaccination_campaign; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vaccination_campaign (end_date, start_date, target_grade, created_at, created_by, vaccination_campaign_id, status, vaccine_type, name, description, notes) VALUES ('2024-11-30', '2024-10-01', NULL, '2025-06-07 21:50:39.98308+07', 72, 5, 'ACTIVE', 'Vaccine cúm mùa', 'Chiến dịch tiêm chủng Cúm mùa 2024-2025', 'Tiêm chủng phòng cúm mùa cho học sinh các cấp', 'Ưu tiên học sinh có bệnh lý nền');
INSERT INTO public.vaccination_campaign (end_date, start_date, target_grade, created_at, created_by, vaccination_campaign_id, status, vaccine_type, name, description, notes) VALUES ('2024-12-31', '2024-09-01', 6, '2025-06-07 21:50:39.98308+07', 72, 6, 'ACTIVE', 'Vaccine HPV', 'Tiêm chủng HPV cho học sinh lớp 6', 'Tiêm vaccine HPV phòng chống ung thư cổ tử cung', 'Chỉ dành cho học sinh nữ');
INSERT INTO public.vaccination_campaign (end_date, start_date, target_grade, created_at, created_by, vaccination_campaign_id, status, vaccine_type, name, description, notes) VALUES ('2024-10-15', '2024-08-15', 7, '2025-06-07 21:50:39.98308+07', 72, 7, 'COMPLETED', 'DPT-IPV-Hib', 'Tiêm bổ sung DPT-IPV-Hib', 'Tiêm bổ sung vaccine 5 trong 1', 'Đã hoàn thành');
INSERT INTO public.vaccination_campaign (end_date, start_date, target_grade, created_at, created_by, vaccination_campaign_id, status, vaccine_type, name, description, notes) VALUES ('2024-12-31', '2024-11-01', NULL, '2025-06-07 21:50:39.98308+07', 72, 8, 'PLANNED', 'Hepatitis B', 'Chiến dịch tiêm Hepatitis B', 'Tiêm vaccine Hepatitis B cho học sinh chưa tiêm', 'Sẽ bắt đầu vào tháng 11');


--
-- Data for Name: vaccination_consent; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vaccination_consent (consent_id, parent_id, response_date, student_id, vaccination_campaign_id, academic_year, consent_status, consent_form_url, notes) VALUES (1, 78, '2024-09-15 10:30:00+07', 41, 5, '2024-2025', 'APPROVED', NULL, 'Đồng ý tiêm chủng');
INSERT INTO public.vaccination_consent (consent_id, parent_id, response_date, student_id, vaccination_campaign_id, academic_year, consent_status, consent_form_url, notes) VALUES (2, 75, '2024-09-16 14:20:00+07', 42, 6, '2024-2025', 'APPROVED', NULL, 'Đồng ý tiêm chủng');
INSERT INTO public.vaccination_consent (consent_id, parent_id, response_date, student_id, vaccination_campaign_id, academic_year, consent_status, consent_form_url, notes) VALUES (3, 76, '2024-09-17 09:45:00+07', 43, 7, '2024-2025', 'DECLINED', NULL, 'Không đồng ý do lo ngại tác dụng phụ');
INSERT INTO public.vaccination_consent (consent_id, parent_id, response_date, student_id, vaccination_campaign_id, academic_year, consent_status, consent_form_url, notes) VALUES (4, 75, '2024-09-10 16:15:00+07', 42, 8, '2024-2025', 'APPROVED', NULL, 'Đồng ý tiêm vaccine HPV');
INSERT INTO public.vaccination_consent (consent_id, parent_id, response_date, student_id, vaccination_campaign_id, academic_year, consent_status, consent_form_url, notes) VALUES (5, 77, NULL, 44, 5, '2024-2025', 'PENDING', NULL, 'Chưa phản hồi');


--
-- Data for Name: vaccination_record; Type: TABLE DATA; Schema: public; Owner: postgres
--

INSERT INTO public.vaccination_record (expiration_date, follow_up_required, next_dose_date, administered_by, administration_date, record_id, student_id, vaccination_campaign_id, academic_year, injection_site, lot_number, vaccine_batch, vaccine_name, follow_up_notes, reaction_notes) VALUES ('2025-10-01', false, NULL, 73, '2024-10-05 09:00:00+07', 4, 41, 5, '2024-2025', 'Cánh tay trái', 'LOT2024A', 'BATCH001', 'Vaccine cúm mùa Influvac', NULL, 'Không có phản ứng bất thường');
INSERT INTO public.vaccination_record (expiration_date, follow_up_required, next_dose_date, administered_by, administration_date, record_id, student_id, vaccination_campaign_id, academic_year, injection_site, lot_number, vaccine_batch, vaccine_name, follow_up_notes, reaction_notes) VALUES ('2025-10-01', false, NULL, 73, '2024-10-05 09:15:00+07', 5, 42, 6, '2024-2025', 'Cánh tay phải', 'LOT2024A', 'BATCH001', 'Vaccine cúm mùa Influvac', 'Theo dõi 24h, không có vấn đề', 'Đau nhẹ tại chỗ tiêm');
INSERT INTO public.vaccination_record (expiration_date, follow_up_required, next_dose_date, administered_by, administration_date, record_id, student_id, vaccination_campaign_id, academic_year, injection_site, lot_number, vaccine_batch, vaccine_name, follow_up_notes, reaction_notes) VALUES ('2026-09-01', true, '2025-03-20', 74, '2024-09-20 14:30:00+07', 6, 43, 7, '2024-2025', 'Cánh tay trái', 'LOT2024B', 'BATCH002', 'Vaccine HPV Gardasil 9', 'Cần tiêm mũi 2 sau 6 tháng', 'Không có phản ứng');


--
-- Name: class_class_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.class_class_id_seq', 24, true);


--
-- Name: health_check_campaign_health_check_campaign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.health_check_campaign_health_check_campaign_id_seq', 6, true);


--
-- Name: health_check_consent_consent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.health_check_consent_consent_id_seq', 4, true);


--
-- Name: health_check_result_result_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.health_check_result_result_id_seq', 6, true);


--
-- Name: health_declaration_declaration_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.health_declaration_declaration_id_seq', 8, true);


--
-- Name: health_declaration_detail_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.health_declaration_detail_detail_id_seq', 4, true);


--
-- Name: medication_medication_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medication_medication_id_seq', 10, true);


--
-- Name: medication_request_detail_detail_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medication_request_detail_detail_id_seq', 4, true);


--
-- Name: medication_request_request_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.medication_request_request_id_seq', 8, true);


--
-- Name: notifications_notification_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.notifications_notification_id_seq', 10, true);


--
-- Name: student_student_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.student_student_id_seq', 45, true);


--
-- Name: user_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.user_user_id_seq', 84, true);


--
-- Name: vaccination_campaign_vaccination_campaign_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vaccination_campaign_vaccination_campaign_id_seq', 8, true);


--
-- Name: vaccination_consent_consent_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vaccination_consent_consent_id_seq', 5, true);


--
-- Name: vaccination_record_record_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.vaccination_record_record_id_seq', 6, true);


--
-- PostgreSQL database dump complete
--

