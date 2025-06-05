-- Thiết lập môi trường
SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', 'public', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';
SET default_table_access_method = heap;

-- Bảng class
CREATE SEQUENCE public.class_class_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.class_class_id_seq OWNER TO postgres;

CREATE TABLE public.class (
                              class_id bigint NOT NULL,
                              class_name character varying(100) NOT NULL,
                              grade integer NOT NULL,
                              totalstudent integer DEFAULT 0,
                              CONSTRAINT class_pkey PRIMARY KEY (class_id),
                              CONSTRAINT class_totalstudent_check CHECK (totalstudent >= 0),
                              CONSTRAINT class_grade_check CHECK (grade BETWEEN 1 AND 12)
);

ALTER TABLE public.class OWNER TO postgres;

ALTER TABLE ONLY public.class
ALTER COLUMN class_id SET DEFAULT nextval('public.class_class_id_seq'::regclass);

ALTER SEQUENCE public.class_class_id_seq OWNED BY public.class.class_id;

-- Bảng health_check_campaign
CREATE SEQUENCE public.health_check_campaign_health_check_campaign_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.health_check_campaign_health_check_campaign_id_seq OWNER TO postgres;

CREATE TABLE public.health_check_campaign (
                                              health_check_campaign_id bigint NOT NULL,
                                              name character varying(255) NOT NULL,
                                              description text,
                                              check_date date NOT NULL,
                                              status character varying(20) NOT NULL,
                                              target_grade integer,
                                              location character varying(100),
                                              required_equipment text,
                                              created_by bigint,
                                              created_at timestamp without time zone DEFAULT now(),
                                              CONSTRAINT health_check_campaign_pkey PRIMARY KEY (health_check_campaign_id),
                                              CONSTRAINT health_check_campaign_status_check CHECK ((status = ANY (ARRAY['PLANNING'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying]))),
                                              CONSTRAINT health_check_campaign_target_grade_check CHECK (target_grade > 0)
);

ALTER TABLE public.health_check_campaign OWNER TO postgres;

ALTER TABLE ONLY public.health_check_campaign
ALTER COLUMN health_check_campaign_id SET DEFAULT nextval('public.health_check_campaign_health_check_campaign_id_seq'::regclass);

ALTER SEQUENCE public.health_check_campaign_health_check_campaign_id_seq OWNED BY public.health_check_campaign.health_check_campaign_id;

-- Bảng health_check_consent
CREATE SEQUENCE public.health_check_consent_consent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.health_check_consent_consent_id_seq OWNER TO postgres;

CREATE TABLE public.health_check_consent (
                                             consent_id bigint NOT NULL,
                                             health_check_campaign_id bigint NOT NULL,
                                             student_id bigint NOT NULL,
                                             parent_id bigint NOT NULL,
                                             consent_status character varying(20) NOT NULL,
                                             response_date timestamp without time zone,
                                             notes text,
                                             special_requests text,
                                             academic_year character varying(9) NOT NULL,
                                             CONSTRAINT health_check_consent_pkey PRIMARY KEY (consent_id),
                                             CONSTRAINT health_check_consent_consent_status_check CHECK ((consent_status = ANY (ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'RESCHEDULED'::character varying]))),
                                             CONSTRAINT health_check_consent_academic_year_check CHECK (academic_year ~ '^[0-9]{4}-[0-9]{4}$')
    );

ALTER TABLE public.health_check_consent OWNER TO postgres;

ALTER TABLE ONLY public.health_check_consent
ALTER COLUMN consent_id SET DEFAULT nextval('public.health_check_consent_consent_id_seq'::regclass);

ALTER SEQUENCE public.health_check_consent_consent_id_seq OWNED BY public.health_check_consent.consent_id;

-- Bảng health_check_result
CREATE SEQUENCE public.health_check_result_result_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.health_check_result_result_id_seq OWNER TO postgres;

CREATE TABLE public.health_check_result (
                                            result_id bigint NOT NULL,
                                            health_check_campaign_id bigint NOT NULL,
                                            student_id bigint NOT NULL,
                                            checked_by bigint NOT NULL,
                                            check_date timestamp without time zone NOT NULL,
                                            height_cm numeric(5,2),
                                            weight_kg numeric(5,2),
                                            bmi numeric(5,2),
                                            vision_left character varying(10),
                                            vision_right character varying(10),
                                            hearing text,
                                            dental_health text,
                                            blood_pressure character varying(20),
                                            pulse integer,
                                            temperature numeric(4,1),
                                            other_notes text,
                                            recommendation text,
                                            follow_up_required boolean DEFAULT false,
                                            follow_up_notes text,
                                            overall_health_rating character varying(20),
                                            academic_year character varying(9) NOT NULL,
                                            CONSTRAINT health_check_result_pkey PRIMARY KEY (result_id),
                                            CONSTRAINT health_check_result_height_check CHECK (height_cm > 0),
                                            CONSTRAINT health_check_result_weight_check CHECK (weight_kg > 0),
                                            CONSTRAINT health_check_result_bmi_check CHECK (bmi > 0),
                                            CONSTRAINT health_check_result_pulse_check CHECK (pulse > 0),
                                            CONSTRAINT health_check_result_temperature_check CHECK (temperature BETWEEN 35.0 AND 42.0),
                                            CONSTRAINT health_check_result_overall_health_rating_check CHECK ((overall_health_rating = ANY (ARRAY['GOOD'::character varying, 'FAIR'::character varying, 'POOR'::character varying]))),
                                            CONSTRAINT health_check_result_academic_year_check CHECK (academic_year ~ '^[0-9]{4}-[0-9]{4}$')
    );

ALTER TABLE public.health_check_result OWNER TO postgres;

ALTER TABLE ONLY public.health_check_result
ALTER COLUMN result_id SET DEFAULT nextval('public.health_check_result_result_id_seq'::regclass);

ALTER SEQUENCE public.health_check_result_result_id_seq OWNED BY public.health_check_result.result_id;

-- Bảng health_declaration
CREATE SEQUENCE public.health_declaration_declaration_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.health_declaration_declaration_id_seq OWNER TO postgres;

CREATE TABLE public.health_declaration (
                                           declaration_id bigint NOT NULL,
                                           student_id bigint NOT NULL,
                                           declared_by bigint NOT NULL,
                                           declaration_date timestamp without time zone DEFAULT now(),
                                           status character varying(20) NOT NULL,
                                           reviewed_by bigint,
                                           reviewed_date timestamp without time zone,
                                           academic_year character varying(9) NOT NULL,
                                           CONSTRAINT health_declaration_pkey PRIMARY KEY (declaration_id),
                                           CONSTRAINT health_declaration_status_check CHECK ((status = ANY (ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying]))),
                                           CONSTRAINT health_declaration_academic_year_check CHECK (academic_year ~ '^[0-9]{4}-[0-9]{4}$'),
    CONSTRAINT health_declaration_date_check CHECK (reviewed_date >= declaration_date)
);

ALTER TABLE public.health_declaration OWNER TO postgres;

ALTER TABLE ONLY public.health_declaration
ALTER COLUMN declaration_id SET DEFAULT nextval('public.health_declaration_declaration_id_seq'::regclass);

ALTER SEQUENCE public.health_declaration_declaration_id_seq OWNED BY public.health_declaration.declaration_id;

-- Bảng health_declaration_detail
CREATE SEQUENCE public.health_declaration_detail_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.health_declaration_detail_detail_id_seq OWNER TO postgres;

CREATE TABLE public.health_declaration_detail (
                                                  detail_id bigint NOT NULL,
                                                  declaration_id bigint NOT NULL,
                                                  category character varying(50) NOT NULL,
                                                  description text NOT NULL,
                                                  severity character varying(20),
                                                  additional_info jsonb,
                                                  created_at timestamp without time zone DEFAULT now(),
                                                  CONSTRAINT health_declaration_detail_pkey PRIMARY KEY (detail_id),
                                                  CONSTRAINT health_declaration_detail_category_check CHECK ((category = ANY (ARRAY['ALLERGY'::character varying, 'CHRONIC_DISEASE'::character varying, 'VACCINATION_HISTORY'::character varying, 'SURGERY_HISTORY'::character varying, 'OTHER'::character varying]))),
                                                  CONSTRAINT health_declaration_detail_severity_check CHECK ((severity = ANY (ARRAY['MILD'::character varying, 'MODERATE'::character varying, 'SEVERE'::character varying])))
);

ALTER TABLE public.health_declaration_detail OWNER TO postgres;

ALTER TABLE ONLY public.health_declaration_detail
ALTER COLUMN detail_id SET DEFAULT nextval('public.health_declaration_detail_detail_id_seq'::regclass);

ALTER SEQUENCE public.health_declaration_detail_detail_id_seq OWNED BY public.health_declaration_detail.detail_id;

-- Bảng medical_event
CREATE SEQUENCE public.medical_event_event_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.medical_event_event_id_seq OWNER TO postgres;

CREATE TABLE public.medical_event (
                                      event_id bigint NOT NULL,
                                      student_id bigint NOT NULL,
                                      reported_by bigint NOT NULL,
                                      event_type character varying(50) NOT NULL,
                                      event_date timestamp without time zone DEFAULT now(),
                                      resolved_date timestamp without time zone,
                                      severity character varying(20) NOT NULL,
                                      description text NOT NULL,
                                      action_taken text,
                                      follow_up_required boolean DEFAULT false,
                                      follow_up_notes text,
                                      location character varying(100),
                                      witnesses text,
                                      academic_year character varying(9) NOT NULL,
                                      CONSTRAINT medical_event_pkey PRIMARY KEY (event_id),
                                      CONSTRAINT medical_event_event_type_check CHECK ((event_type = ANY (ARRAY['ACCIDENT'::character varying, 'ILLNESS'::character varying, 'INJURY'::character varying, 'ALLERGIC_REACTION'::character varying, 'OTHER'::character varying]))),
                                      CONSTRAINT medical_event_severity_check CHECK ((severity = ANY (ARRAY['MILD'::character varying, 'MODERATE'::character varying, 'SEVERE'::character varying, 'CRITICAL'::character varying]))),
                                      CONSTRAINT medical_event_date_check CHECK (resolved_date >= event_date),
                                      CONSTRAINT medical_event_academic_year_check CHECK (academic_year ~ '^[0-9]{4}-[0-9]{4}$')
    );

ALTER TABLE public.medical_event OWNER TO postgres;

ALTER TABLE ONLY public.medical_event
ALTER COLUMN event_id SET DEFAULT nextval('public.medical_event_event_id_seq'::regclass);

ALTER SEQUENCE public.medical_event_event_id_seq OWNED BY public.medical_event.event_id;

-- Bảng medical_event_medication
CREATE SEQUENCE public.medical_event_medication_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.medical_event_medication_id_seq OWNER TO postgres;

CREATE TABLE public.medical_event_medication (
                                                 id bigint NOT NULL,
                                                 event_id bigint NOT NULL,
                                                 medication_id bigint NOT NULL,
                                                 administered_by bigint NOT NULL,
                                                 administration_time timestamp without time zone NOT NULL,
                                                 dosage text NOT NULL,
                                                 notes text,
                                                 effectiveness character varying(20),
                                                 CONSTRAINT medical_event_medication_pkey PRIMARY KEY (id),
                                                 CONSTRAINT medical_event_medication_effectiveness_check CHECK ((effectiveness = ANY (ARRAY['NONE'::character varying, 'LITTLE'::character varying, 'SOME'::character varying, 'SIGNIFICANT'::character varying, 'COMPLETE'::character varying])))
);

ALTER TABLE public.medical_event_medication OWNER TO postgres;

ALTER TABLE ONLY public.medical_event_medication
ALTER COLUMN id SET DEFAULT nextval('public.medical_event_medication_id_seq'::regclass);

ALTER SEQUENCE public.medical_event_medication_id_seq OWNED BY public.medical_event_medication.id;

-- Bảng medication
CREATE SEQUENCE public.medication_medication_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.medication_medication_id_seq OWNER TO postgres;

CREATE TABLE public.medication (
                                   medication_id bigint NOT NULL,
                                   prescription_required boolean DEFAULT true NOT NULL,
                                   country_of_origin character varying(100),
                                   dosage_form character varying(100) NOT NULL,
                                   category character varying(255) NOT NULL,
                                   description character varying(255),
                                   medication_information text,
                                   medication_name character varying(255) NOT NULL,
                                   medication_img text,
                                   active_ingredient character varying(255),
                                   manufacturer character varying(255),
                                   created_at timestamp without time zone DEFAULT now(),
                                   updated_at timestamp without time zone,
                                   CONSTRAINT medication_pkey PRIMARY KEY (medication_id),
                                   CONSTRAINT medication_category_check CHECK ((category = ANY (ARRAY['ANALGESIC'::character varying, 'ANTIBIOTIC'::character varying, 'ANTIHISTAMINE'::character varying, 'VACCINE'::character varying, 'OTHER'::character varying])))
);

ALTER TABLE public.medication OWNER TO postgres;

ALTER TABLE ONLY public.medication
ALTER COLUMN medication_id SET DEFAULT nextval('public.medication_medication_id_seq'::regclass);

ALTER SEQUENCE public.medication_medication_id_seq OWNED BY public.medication.medication_id;

-- Bảng medication_request
CREATE SEQUENCE public.medication_request_request_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.medication_request_request_id_seq OWNER TO postgres;

CREATE TABLE public.medication_request (
                                           request_id bigint NOT NULL,
                                           student_id bigint NOT NULL,
                                           requested_by bigint NOT NULL,
                                           reviewed_by bigint,
                                           request_date timestamp without time zone DEFAULT now(),
                                           review_date timestamp without time zone,
                                           status character varying(20) NOT NULL,
                                           notes text,
                                           priority character varying(20),
                                           academic_year character varying(9) NOT NULL,
                                           CONSTRAINT medication_request_pkey PRIMARY KEY (request_id),
                                           CONSTRAINT medication_request_priority_check CHECK ((priority = ANY (ARRAY['LOW'::character varying, 'MEDIUM'::character varying, 'HIGH'::character varying, 'EMERGENCY'::character varying]))),
                                           CONSTRAINT medication_request_status_check CHECK ((status = ANY (ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying]))),
                                           CONSTRAINT medication_request_date_check CHECK (review_date >= request_date),
                                           CONSTRAINT medication_request_academic_year_check CHECK (academic_year ~ '^[0-9]{4}-[0-9]{4}$')
    );

ALTER TABLE public.medication_request OWNER TO postgres;

ALTER TABLE ONLY public.medication_request
ALTER COLUMN request_id SET DEFAULT nextval('public.medication_request_request_id_seq'::regclass);

ALTER SEQUENCE public.medication_request_request_id_seq OWNED BY public.medication_request.request_id;

-- Bảng medication_request_detail
CREATE SEQUENCE public.medication_request_detail_detail_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.medication_request_detail_detail_id_seq OWNER TO postgres;

CREATE TABLE public.medication_request_detail (
                                                  detail_id bigint NOT NULL,
                                                  request_id bigint NOT NULL,
                                                  medication_id bigint NOT NULL,
                                                  dosage text NOT NULL,
                                                  frequency text NOT NULL,
                                                  administration_time time without time zone[],
                                                  start_date date NOT NULL,
                                                  end_date date NOT NULL,
                                                  quantity integer NOT NULL,
                                                  attachment_url text,
                                                  actual_administration jsonb,
                                                  status character varying(20),
                                                  CONSTRAINT medication_request_detail_pkey PRIMARY KEY (detail_id),
                                                  CONSTRAINT medication_request_detail_quantity_check CHECK (quantity > 0),
                                                  CONSTRAINT medication_request_detail_status_check CHECK ((status = ANY (ARRAY['PENDING'::character varying, 'ADMINISTERED'::character varying, 'MISSED'::character varying, 'CANCELLED'::character varying]))),
                                                  CONSTRAINT medication_request_detail_date_check CHECK (end_date >= start_date)
);

ALTER TABLE public.medication_request_detail OWNER TO postgres;

ALTER TABLE ONLY public.medication_request_detail
ALTER COLUMN detail_id SET DEFAULT nextval('public.medication_request_detail_detail_id_seq'::regclass);

ALTER SEQUENCE public.medication_request_detail_detail_id_seq OWNED BY public.medication_request_detail.detail_id;

-- Bảng notification
CREATE SEQUENCE public.notification_notification_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.notification_notification_id_seq OWNER TO postgres;

CREATE TABLE public.notification (
                                     notification_id bigint NOT NULL,
                                     user_id bigint NOT NULL,
                                     title character varying(255) NOT NULL,
                                     content text NOT NULL,
                                     notification_type character varying(50) NOT NULL,
                                     related_id bigint,
                                     status character varying(20) NOT NULL,
                                     created_at timestamp without time zone DEFAULT now(),
                                     read_at timestamp without time zone,
                                     priority character varying(20),
                                     action_url text,
                                     CONSTRAINT notification_pkey PRIMARY KEY (notification_id),
                                     CONSTRAINT notification_notification_type_check CHECK ((notification_type = ANY (ARRAY['HEALTH_CHECK'::character varying, 'VACCINATION'::character varying, 'MEDICATION'::character varying, 'EVENT'::character varying, 'SYSTEM'::character varying]))),
                                     CONSTRAINT notification_priority_check CHECK ((priority = ANY (ARRAY['LOW'::character varying, 'MEDIUM'::character varying, 'HIGH'::character varying, 'URGENT'::character varying]))),
                                     CONSTRAINT notification_status_check CHECK ((status = ANY (ARRAY['UNREAD'::character varying, 'READ'::character varying, 'ARCHIVED'::character varying]))),
                                     CONSTRAINT notification_date_check CHECK (read_at >= created_at)
);

ALTER TABLE public.notification OWNER TO postgres;

ALTER TABLE ONLY public.notification
ALTER COLUMN notification_id SET DEFAULT nextval('public.notification_notification_id_seq'::regclass);

ALTER SEQUENCE public.notification_notification_id_seq OWNED BY public.notification.notification_id;

-- Bảng student
CREATE SEQUENCE public.student_student_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.student_student_id_seq OWNER TO postgres;

CREATE TABLE public.student (
                                student_id bigint NOT NULL,
                                user_id bigint,
                                class_id bigint,
                                student_code character varying(50) NOT NULL,
                                blood_type character varying(10),
                                genetic_diseases text,
                                other_medical_notes text,
                                emergency_contact jsonb,
                                created_at timestamp without time zone DEFAULT now(),
                                updated_at timestamp without time zone,
                                CONSTRAINT student_pkey PRIMARY KEY (student_id),
                                CONSTRAINT student_student_code_key UNIQUE (student_code),
                                CONSTRAINT student_user_id_key UNIQUE (user_id),
                                CONSTRAINT student_blood_type_check CHECK ((blood_type = ANY (ARRAY['A+'::character varying, 'A-'::character varying, 'B+'::character varying, 'B-'::character varying, 'AB+'::character varying, 'AB-'::character varying, 'O+'::character varying, 'O-'::character varying])))
);

ALTER TABLE public.student OWNER TO postgres;

ALTER TABLE ONLY public.student
ALTER COLUMN student_id SET DEFAULT nextval('public.student_student_id_seq'::regclass);

ALTER SEQUENCE public.student_student_id_seq OWNED BY public.student.student_id;

-- Bảng user
CREATE SEQUENCE public.user_user_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.user_user_id_seq OWNER TO postgres;

CREATE TABLE public."user" (
                               user_id bigint NOT NULL,
                               username character varying(255),
                               password text NOT NULL,
                               fullname character varying(255) NOT NULL,
                               email character varying(255),
                               phone character varying(20) NOT NULL,
                               dob date,
                               gender character varying(10),
                               address text,
                               avatar_url text,
                               status character varying(20) NOT NULL,
                               role_name character varying(20) NOT NULL,
                               created_at timestamp without time zone DEFAULT now(),
                               updated_at timestamp without time zone,
                               CONSTRAINT user_pkey PRIMARY KEY (user_id),
                               CONSTRAINT user_username_key UNIQUE (username),
                               CONSTRAINT user_email_key UNIQUE (email),
                               CONSTRAINT user_phone_key UNIQUE (phone),
                               CONSTRAINT user_role_name_check CHECK ((role_name = ANY (ARRAY['ADMIN'::character varying, 'NURSE'::character varying, 'PARENT'::character varying, 'STUDENT'::character varying, 'TEACHER'::character varying]))),
                               CONSTRAINT user_status_check CHECK ((status = ANY (ARRAY['ACTIVE'::character varying, 'INACTIVE'::character varying, 'PENDING'::character varying, 'SUSPENDED'::character varying]))),
                               CONSTRAINT user_gender_check CHECK ((gender = ANY (ARRAY['MALE'::character varying, 'FEMALE'::character varying, 'OTHER'::character varying])))
);

ALTER TABLE public."user" OWNER TO postgres;

ALTER TABLE ONLY public."user"
ALTER COLUMN user_id SET DEFAULT nextval('public.user_user_id_seq'::regclass);

ALTER SEQUENCE public.user_user_id_seq OWNED BY public."user".user_id;

-- Bảng vaccination_campaign
CREATE SEQUENCE public.vaccination_campaign_vaccination_campaign_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.vaccination_campaign_vaccination_campaign_id_seq OWNER TO postgres;

CREATE TABLE public.vaccination_campaign (
                                             vaccination_campaign_id bigint NOT NULL,
                                             name character varying(255) NOT NULL,
                                             description text,
                                             start_date date NOT NULL,
                                             end_date date NOT NULL,
                                             status character varying(20) NOT NULL,
                                             target_grade integer,
                                             vaccine_type character varying(100) NOT NULL,
                                             notes text,
                                             created_by bigint,
                                             created_at timestamp without time zone DEFAULT now(),
                                             CONSTRAINT vaccination_campaign_pkey PRIMARY KEY (vaccination_campaign_id),
                                             CONSTRAINT vaccination_campaign_status_check CHECK ((status = ANY (ARRAY['PLANNING'::character varying, 'IN_PROGRESS'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying]))),
                                             CONSTRAINT vaccination_campaign_date_check CHECK (end_date >= start_date),
                                             CONSTRAINT vaccination_campaign_target_grade_check CHECK (target_grade > 0)
);

ALTER TABLE public.vaccination_campaign OWNER TO postgres;

ALTER TABLE ONLY public.vaccination_campaign
ALTER COLUMN vaccination_campaign_id SET DEFAULT nextval('public.vaccination_campaign_vaccination_campaign_id_seq'::regclass);

ALTER SEQUENCE public.vaccination_campaign_vaccination_campaign_id_seq OWNED BY public.vaccination_campaign.vaccination_campaign_id;

-- Bảng vaccination_consent
CREATE SEQUENCE public.vaccination_consent_consent_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.vaccination_consent_consent_id_seq OWNER TO postgres;

CREATE TABLE public.vaccination_consent (
                                            consent_id bigint NOT NULL,
                                            vaccination_campaign_id bigint NOT NULL,
                                            student_id bigint NOT NULL,
                                            parent_id bigint NOT NULL,
                                            consent_status character varying(20) NOT NULL,
                                            response_date timestamp without time zone,
                                            notes text,
                                            consent_form_url text,
                                            academic_year character varying(9) NOT NULL,
                                            CONSTRAINT vaccination_consent_pkey PRIMARY KEY (consent_id),
                                            CONSTRAINT vaccination_consent_consent_status_check CHECK ((consent_status = ANY (ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying, 'RESCHEDULED'::character varying]))),
                                            CONSTRAINT vaccination_consent_academic_year_check CHECK (academic_year ~ '^[0-9]{4}-[0-9]{4}$')
    );

ALTER TABLE public.vaccination_consent OWNER TO postgres;

ALTER TABLE ONLY public.vaccination_consent
ALTER COLUMN consent_id SET DEFAULT nextval('public.vaccination_consent_consent_id_seq'::regclass);

ALTER SEQUENCE public.vaccination_consent_consent_id_seq OWNED BY public.vaccination_consent.consent_id;

-- Bảng vaccination_record
CREATE SEQUENCE public.vaccination_record_record_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;

ALTER SEQUENCE public.vaccination_record_record_id_seq OWNER TO postgres;

CREATE TABLE public.vaccination_record (
                                           record_id bigint NOT NULL,
                                           vaccination_campaign_id bigint NOT NULL,
                                           student_id bigint NOT NULL,
                                           vaccine_name character varying(255) NOT NULL,
                                           vaccine_batch character varying(100) NOT NULL,
                                           administered_by bigint NOT NULL,
                                           administration_date timestamp without time zone NOT NULL,
                                           next_dose_date date,
                                           reaction_notes text,
                                           follow_up_required boolean DEFAULT false,
                                           follow_up_notes text,
                                           injection_site character varying(50),
                                           lot_number character varying(100),
                                           expiration_date date,
                                           academic_year character varying(9) NOT NULL,
                                           CONSTRAINT vaccination_record_pkey PRIMARY KEY (record_id),
                                           CONSTRAINT vaccination_record_injection_site_check CHECK ((injection_site = ANY (ARRAY['ARM'::character varying, 'THIGH'::character varying, 'OTHER'::character varying]))),
                                           CONSTRAINT vaccination_record_date_check CHECK (expiration_date > administration_date),
                                           CONSTRAINT vaccination_record_academic_year_check CHECK (academic_year ~ '^[0-9]{4}-[0-9]{4}$')
    );

ALTER TABLE public.vaccination_record OWNER TO postgres;

ALTER TABLE ONLY public.vaccination_record
ALTER COLUMN record_id SET DEFAULT nextval('public.vaccination_record_record_id_seq'::regclass);

ALTER SEQUENCE public.vaccination_record_record_id_seq OWNED BY public.vaccination_record.record_id;

-- Thêm các ràng buộc khóa ngoại
ALTER TABLE ONLY public.health_check_campaign
    ADD CONSTRAINT health_check_campaign_created_by_fkey FOREIGN KEY (created_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.health_check_consent
    ADD CONSTRAINT health_check_consent_health_check_campaign_id_fkey FOREIGN KEY (health_check_campaign_id) REFERENCES public.health_check_campaign(health_check_campaign_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.health_check_consent
    ADD CONSTRAINT health_check_consent_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.health_check_consent
    ADD CONSTRAINT health_check_consent_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.health_check_result
    ADD CONSTRAINT health_check_result_health_check_campaign_id_fkey FOREIGN KEY (health_check_campaign_id) REFERENCES public.health_check_campaign(health_check_campaign_id);

ALTER TABLE ONLY public.health_check_result
    ADD CONSTRAINT health_check_result_checked_by_fkey FOREIGN KEY (checked_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.health_check_result
    ADD CONSTRAINT health_check_result_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.health_declaration
    ADD CONSTRAINT health_declaration_declared_by_fkey FOREIGN KEY (declared_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.health_declaration
    ADD CONSTRAINT health_declaration_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.health_declaration
    ADD CONSTRAINT health_declaration_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.health_declaration_detail
    ADD CONSTRAINT health_declaration_detail_declaration_id_fkey FOREIGN KEY (declaration_id) REFERENCES public.health_declaration(declaration_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.medical_event
    ADD CONSTRAINT medical_event_reported_by_fkey FOREIGN KEY (reported_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.medical_event
    ADD CONSTRAINT medical_event_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.medical_event_medication
    ADD CONSTRAINT medical_event_medication_event_id_fkey FOREIGN KEY (event_id) REFERENCES public.medical_event(event_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.medical_event_medication
    ADD CONSTRAINT medical_event_medication_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medication(medication_id);

ALTER TABLE ONLY public.medical_event_medication
    ADD CONSTRAINT medical_event_medication_administered_by_fkey FOREIGN KEY (administered_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.medication_request
    ADD CONSTRAINT medication_request_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.medication_request
    ADD CONSTRAINT medication_request_requested_by_fkey FOREIGN KEY (requested_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.medication_request
    ADD CONSTRAINT medication_request_reviewed_by_fkey FOREIGN KEY (reviewed_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.medication_request_detail
    ADD CONSTRAINT medication_request_detail_request_id_fkey FOREIGN KEY (request_id) REFERENCES public.medication_request(request_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.medication_request_detail
    ADD CONSTRAINT medication_request_detail_medication_id_fkey FOREIGN KEY (medication_id) REFERENCES public.medication(medication_id);

ALTER TABLE ONLY public.notification
    ADD CONSTRAINT notification_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_class_id_fkey FOREIGN KEY (class_id) REFERENCES public.class(class_id);

ALTER TABLE ONLY public.student
    ADD CONSTRAINT student_user_id_fkey FOREIGN KEY (user_id) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.vaccination_campaign
    ADD CONSTRAINT vaccination_campaign_created_by_fkey FOREIGN KEY (created_by) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.vaccination_consent
    ADD CONSTRAINT vaccination_consent_vaccination_campaign_id_fkey FOREIGN KEY (vaccination_campaign_id) REFERENCES public.vaccination_campaign(vaccination_campaign_id) ON DELETE CASCADE;

ALTER TABLE ONLY public.vaccination_consent
    ADD CONSTRAINT vaccination_consent_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.vaccination_consent
    ADD CONSTRAINT vaccination_consent_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public."user"(user_id);

ALTER TABLE ONLY public.vaccination_record
    ADD CONSTRAINT vaccination_record_vaccination_campaign_id_fkey FOREIGN KEY (vaccination_campaign_id) REFERENCES public.vaccination_campaign(vaccination_campaign_id);

ALTER TABLE ONLY public.vaccination_record
    ADD CONSTRAINT vaccination_record_student_id_fkey FOREIGN KEY (student_id) REFERENCES public.student(student_id);

ALTER TABLE ONLY public.vaccination_record
    ADD CONSTRAINT vaccination_record_administered_by_fkey FOREIGN KEY (administered_by) REFERENCES public."user"(user_id);

-- Thêm các chỉ mục
CREATE INDEX idx_health_check_campaign_status ON public.health_check_campaign USING btree (status);
CREATE INDEX idx_health_check_consent_student ON public.health_check_consent USING btree (student_id);
CREATE INDEX idx_health_declaration_student ON public.health_declaration USING btree (student_id);
CREATE INDEX idx_medical_event_student ON public.medical_event USING btree (student_id);
CREATE INDEX idx_medication_request_status ON public.medication_request USING btree (status);
CREATE INDEX idx_medication_request_student ON public.medication_request USING btree (student_id);
CREATE INDEX idx_notification_status ON public.notification USING btree (status);
CREATE INDEX idx_notification_user ON public.notification USING btree (user_id);
CREATE INDEX idx_student_class ON public.student USING btree (class_id);
CREATE INDEX idx_vaccination_campaign_status ON public.vaccination_campaign USING btree (status);
CREATE INDEX idx_vaccination_consent_student ON public.vaccination_consent USING btree (student_id);