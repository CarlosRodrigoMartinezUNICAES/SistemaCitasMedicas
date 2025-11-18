# Sistema de Citas Médicas - Functional and Technical Specification

## 1. Project Overview
This document provides a comprehensive overview of the Sistema de Citas Médicas (Medical Appointment System), detailing its functional requirements, technical architecture, API specifications, and database design. The system aims to streamline the appointment booking and management process for both patients and doctors in a medical facility.

## 2. Functional Requirements

### 2.1. Patient Module
- View appointments with status tracking (Pendiente, Confirmada, Atendida, Cancelada).
- Create new appointments by selecting a specialty, date, and time.
- View medical history (consultas) associated with their appointments.
- Update personal profile information.
- Data validation for personal information (DUI, phone, email, age).

### 2.2. Doctor Module
- Calendar view displaying all scheduled appointments.
- Management of appointments, including updating their status (Confirmada, Atendida, Cancelada).
- Access to a database of patients.
- Generation of comprehensive reports with analytics.
- Statistics dashboard for an overview of appointments and patient data.

### 2.3. General Features
- Secure login system with role-based routing (Patient, Doctor).
- Robust database connection handling with connection pooling.
- Comprehensive error handling and input validation across the system.
- Responsive design for optimal viewing on various devices.
- Smooth page transitions for an enhanced user experience.

## 3. Technical Architecture

### 3.1. Frontend
- **Framework:** React with Vite for fast development and optimized builds.
- **Styling:** Custom CSS and potentially a utility-first CSS framework (e.g., Tailwind CSS, as indicated by `tailwind.config.js`).
- **State Management:** Local component state, potentially React Context or other solutions for global state.
- **Routing:** React Router for navigation between pages.
- **API Communication:** Fetch API or Axios for interacting with the backend.

### 3.2. Backend
- **Framework:** Node.js with Express.js.
- **Language:** TypeScript for type safety and improved code quality.
- **Database ORM/Driver:** `mariadb` client for direct interaction with the MariaDB database.
- **Authentication:** (To be implemented: JWT or session tokens).
- **Environment Variables:** `dotenv` for managing sensitive configuration.

### 3.3. Database
- **Type:** MariaDB.
- **Connection:** Managed via a connection pool (`mariadb` client) for efficient resource utilization.
- **Schema:** Detailed below.

## 4. API Endpoints

### 4.1. Authentication
- `POST /api/auth/login`: Authenticates a user and returns a token/session.
- `POST /api/auth/register`: Registers a new user (if enabled).

### 4.2. Citas (Appointments)
- `GET /api/cita`: Retrieve all appointments (potentially with filters for patient/doctor).
- `GET /api/cita/:id`: Retrieve a specific appointment by ID.
- `POST /api/cita`: Create a new appointment.
- `PUT /api/cita/:id/estado`: Update the status of an appointment (e.g., Pendiente, Confirmada, Atendida, Cancelada).
- `GET /api/cita/especialidades/list`: Retrieve a list of all medical specialties from the database.

### 4.3. Pacientes (Patients)
- `GET /api/paciente`: Retrieve all patient records (Doctor access).
- `GET /api/paciente/:id`: Retrieve a specific patient record by ID.
- `PUT /api/paciente/:id`: Update a patient's profile information.

### 4.4. Doctores (Doctors)
- `GET /api/doctor`: Retrieve all doctor records.
- `GET /api/doctor/:id`: Retrieve a specific doctor record by ID.

### 4.5. Consultas (Medical Consultations)
- `GET /api/consulta`: Retrieve all consultation records (potentially with filters).
- `GET /api/consulta/:id`: Retrieve a specific consultation record by ID.
- `GET /api/consulta/paciente/:id_paciente`: Retrieve all consultation records for a specific patient.
- `POST /api/consulta`: Create a new consultation record (Doctor only).

### 4.6. Especialidades (Specialties)
- `GET /api/especialidad`: Retrieve all medical specialties.

## 5. Database Schema

The database schema is designed to support the core functionalities of the medical appointment system.

### Tables:

#### `Usuario`
- `id_usuario` (INT, PK, AUTO_INCREMENT): Unique identifier for the user.
- `nombre` (VARCHAR): User's first name.
- `apellido` (VARCHAR): User's last name.
- `email` (VARCHAR, UNIQUE): User's email address, used for login.
- `password_hash` (VARCHAR): Hashed password for security.
- `rol` (ENUM('Paciente', 'Doctor', 'Admin')): User's role in the system.

#### `Paciente`
- `id_paciente` (INT, PK, FK to `Usuario.id_usuario`): Unique identifier for the patient, links to `Usuario`.
- `fecha_nacimiento` (DATE): Patient's date of birth.
- `genero` (ENUM('Masculino', 'Femenino', 'Otro')): Patient's gender.
- `direccion` (VARCHAR): Patient's address.
- `telefono` (VARCHAR): Patient's phone number.
- `dui` (VARCHAR, UNIQUE): Patient's national identification number.

#### `Doctor`
- `id_doctor` (INT, PK, FK to `Usuario.id_usuario`): Unique identifier for the doctor, links to `Usuario`.
- `id_especialidad` (INT, FK to `Especialidad.id_especialidad`): Doctor's medical specialty.
- `licencia_medica` (VARCHAR, UNIQUE): Doctor's medical license number.

#### `Especialidad`
- `id_especialidad` (INT, PK, AUTO_INCREMENT): Unique identifier for the specialty.
- `nombre` (VARCHAR, UNIQUE): Name of the medical specialty (e.g., "Cardiología", "Pediatría").
- `descripcion` (TEXT): Description of the specialty.

#### `Cita` (Appointment)
- `id_cita` (INT, PK, AUTO_INCREMENT): Unique identifier for the appointment.
- `id_paciente` (INT, FK to `Paciente.id_paciente`): Patient who booked the appointment.
- `id_doctor` (INT, FK to `Doctor.id_doctor`): Doctor for the appointment.
- `fecha` (DATE): Date of the appointment.
- `hora` (TIME): Time of the appointment.
- `estado` (ENUM('Pendiente', 'Confirmada', 'Atendida', 'Cancelada')): Current status of the appointment.
- `motivo` (TEXT): Reason for the appointment.

#### `Consulta` (Medical Consultation Record)
- `id_consulta` (INT, PK, AUTO_INCREMENT): Unique identifier for the consultation record.
- `id_cita` (INT, FK to `Cita.id_cita`): The appointment this consultation is associated with.
- `diagnostico` (TEXT): Doctor's diagnosis.
- `tratamiento` (TEXT): Prescribed treatment.
- `notas` (TEXT): Additional notes from the doctor.
- `fecha_consulta` (DATETIME): Date and time when the consultation record was created.

#### `Horario_Doctor` (Doctor's Schedule/Availability)
- `id_horario` (INT, PK, AUTO_INCREMENT): Unique identifier for the schedule entry.
- `id_doctor` (INT, FK to `Doctor.id_doctor`): Doctor whose schedule this is.
- `dia_semana` (ENUM('Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo')): Day of the week.
- `hora_inicio` (TIME): Start time of availability.
- `hora_fin` (TIME): End time of availability.

### Relationships:
- `Usuario` 1-to-1 with `Paciente` (via `id_paciente`)
- `Usuario` 1-to-1 with `Doctor` (via `id_doctor`)
- `Doctor` Many-to-1 with `Especialidad`
- `Cita` Many-to-1 with `Paciente`
- `Cita` Many-to-1 with `Doctor`
- `Consulta` Many-to-1 with `Cita`
- `Horario_Doctor` Many-to-1 with `Doctor`

## 6. Authentication and Authorization
- **Authentication:** Currently uses a simple email/password check. **(Needs password hashing and JWT/session tokens for production)**.
- **Authorization:** Role-based access control (RBAC) is implemented at a high level, distinguishing between 'Paciente' and 'Doctor' roles for routing. Granular API endpoint authorization needs further implementation.

## 7. Error Handling
- Backend includes `try-catch` blocks in routes for basic error handling.
- Frontend displays generic error messages for API failures. **(Needs more specific and user-friendly error messages)**.
- Database connection errors are handled, leading to process exit on critical failure.

## 8. Deployment and Setup
Refer to the `README.md` file for detailed instructions on setting up the development environment, installing dependencies, and running the application.

## 9. Future Improvements
This section summarizes the remaining recommendations and critical missing functionalities identified during the system review. For a detailed list, refer to `SYSTEM_REVIEW.md` and `IMPROVEMENTS_IMPLEMENTED.md`.

### High Priority
- Password hashing and session management (JWT).
- Input sanitization to prevent SQL injection.
- Double-booking prevention for appointments.
- Functionality to create medical consultation records.

### Medium Priority
- Appointment filtering by date range and status.
- More specific validation messages.
- Better date validation (e.g., preventing booking in the past).

### Low Priority / Nice to Have
- Doctor schedule management using the `Horario_Doctor` table.
- Email notifications for appointment confirmations/cancellations.
- Export reports to PDF.
- Patient search functionality in the doctor panel.
- Replacing `alert()` and `confirm()` with custom modals.
- Adding a proper logging system.
- Writing comprehensive unit and E2E tests.
- Adding JSDoc comments for complex functions.
- Implementing proper state management (e.g., Redux/Zustand).
