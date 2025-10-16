-- ==========================================
--   SISTEMA DE GESTIÓN DE CITAS MÉDICAS
--   VERSIÓN PARA MARIADB
-- ==========================================

-- === Eliminación preventiva de tablas (en orden correcto por dependencias) ===
DROP TABLE IF EXISTS Consulta;
DROP TABLE IF EXISTS Cita;
DROP TABLE IF EXISTS Horario_Doctor;
DROP TABLE IF EXISTS Doctor;
DROP TABLE IF EXISTS Paciente;
DROP TABLE IF EXISTS Especialidad;
DROP TABLE IF EXISTS Usuario;


-- ==========================================
-- TABLA USUARIO
-- ==========================================
CREATE TABLE Usuario (
    id_usuario VARCHAR(10) PRIMARY KEY,
    tipo_usuario VARCHAR(10) NOT NULL CHECK (tipo_usuario IN ('Paciente','Doctor')),
    username VARCHAR(50) UNIQUE NOT NULL,
    password_hash VARCHAR(100) NOT NULL
);


-- ==========================================
-- TABLA ESPECIALIDAD
-- ==========================================
CREATE TABLE Especialidad (
    id_especialidad VARCHAR(10) PRIMARY KEY CHECK (id_especialidad REGEXP '^E[0-9].*'),
    nombre VARCHAR(50) NOT NULL UNIQUE CHECK (nombre REGEXP '^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$'),
    descripcion VARCHAR(150) CHECK (CHAR_LENGTH(descripcion) >= 10 OR descripcion IS NULL)
);


-- ==========================================
-- TABLA PACIENTE
-- ==========================================
CREATE TABLE Paciente (
    id_paciente VARCHAR(10) PRIMARY KEY CHECK (id_paciente REGEXP '^P[0-9].*'),
    id_usuario VARCHAR(10) UNIQUE NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL CHECK (nombre_completo REGEXP '^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$'),
    telefono VARCHAR(15) CHECK (telefono REGEXP '^[267][0-9]{7}$'),
    correo VARCHAR(100) UNIQUE CHECK (correo LIKE '_%@_%._%'),
    edad INT CHECK (edad BETWEEN 0 AND 120),
    dui VARCHAR(10) UNIQUE CHECK (dui REGEXP '^[0-9]{8}-[0-9]$'),
    CONSTRAINT fk_paciente_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);


-- ==========================================
-- TABLA DOCTOR
-- ==========================================
CREATE TABLE Doctor (
    id_doctor VARCHAR(10) PRIMARY KEY CHECK (id_doctor REGEXP '^D[0-9].*'),
    id_usuario VARCHAR(10) UNIQUE NOT NULL,
    nombre_completo VARCHAR(100) NOT NULL CHECK (nombre_completo REGEXP '^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$'),
    codigo_trabajador VARCHAR(20) NOT NULL UNIQUE CHECK (codigo_trabajador REGEXP '^[A-Za-z0-9-]+$'),
    telefono VARCHAR(15) CHECK (telefono REGEXP '^[267][0-9]{7}$'),
    id_especialidad VARCHAR(10) NOT NULL,
    CONSTRAINT fk_doctor_especialidad FOREIGN KEY (id_especialidad) REFERENCES Especialidad(id_especialidad),
    CONSTRAINT fk_doctor_usuario FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);


-- ==========================================
-- TABLA HORARIO DOCTOR
-- ==========================================
CREATE TABLE Horario_Doctor (
    id_horario VARCHAR(10) PRIMARY KEY,
    id_doctor VARCHAR(10) NOT NULL,
    dia_semana VARCHAR(10) NOT NULL,
    hora_inicio TIME NOT NULL,
    hora_fin TIME NOT NULL,
    CONSTRAINT fk_horario_doctor FOREIGN KEY (id_doctor) REFERENCES Doctor(id_doctor),
    CONSTRAINT uq_horario UNIQUE (id_doctor, dia_semana, hora_inicio, hora_fin)
);


-- ==========================================
-- TABLA CITA
-- ==========================================
CREATE TABLE Cita (
    id_cita VARCHAR(10) PRIMARY KEY CHECK (id_cita REGEXP '^C[0-9].*'),
    fecha DATE NOT NULL CHECK (fecha >= '2000-01-01'),
    hora TIME NOT NULL,
    estado VARCHAR(20) NOT NULL CHECK (estado IN ('Pendiente','Confirmada','Cancelada','Atendida')),
    id_paciente VARCHAR(10) NOT NULL,
    id_doctor VARCHAR(10) NOT NULL,
    CONSTRAINT fk_cita_paciente FOREIGN KEY (id_paciente) REFERENCES Paciente(id_paciente) ON DELETE CASCADE,
    CONSTRAINT fk_cita_doctor FOREIGN KEY (id_doctor) REFERENCES Doctor(id_doctor) ON DELETE CASCADE
);


-- ==========================================
-- TABLA CONSULTA
-- ==========================================
CREATE TABLE Consulta (
    id_consulta VARCHAR(10) PRIMARY KEY CHECK (id_consulta REGEXP '^CO[0-9].*'),
    reporte_paciente VARCHAR(500) CHECK (CHAR_LENGTH(reporte_paciente) >= 10 OR reporte_paciente IS NULL),
    fecha_consulta DATE NOT NULL,
    id_cita VARCHAR(10) NOT NULL,
    CONSTRAINT fk_consulta_cita FOREIGN KEY (id_cita) REFERENCES Cita(id_cita) ON DELETE CASCADE
);


-- ==========================================
-- INSERCIÓN DE DATOS
-- ==========================================

-- Usuarios
INSERT INTO Usuario VALUES 
('P0001','Paciente','carlos.m','hash123'),
('P0002','Paciente','maria.l','hash234'),
('P0003','Paciente','jose.r','hash345'),
('P0004','Paciente','luisa.t','hash456'),
('P0005','Paciente','ricardo.e','hash567'),
('P0006','Paciente','daniela.c','hash678'),
('P0007','Paciente','mario.h','hash789'),
('D0001','Doctor','juan.p','hash901'),
('D0002','Doctor','ana.m','hash012'),
('D0003','Doctor','luis.g','hash1234'),
('D0004','Doctor','carmen.r','hash2345'),
('D0005','Doctor','ernesto.c','hash3456');


-- Especialidades
INSERT INTO Especialidad VALUES 
('E0001','Pediatría','Atención médica para niños y adolescentes'),
('E0002','Cardiología','Diagnóstico y tratamiento de enfermedades del corazón'),
('E0003','Ginecología','Salud reproductiva y atención a la mujer'),
('E0004','Dermatología','Tratamiento de enfermedades de la piel'),
('E0005','Neurología','Diagnóstico y tratamiento de enfermedades del sistema nervioso');


-- Doctores
INSERT INTO Doctor VALUES 
('D0001','D0001','Juan Pérez','DOC001','70123456','E0001'),
('D0002','D0002','Ana Morales','DOC002','70129876','E0002'),
('D0003','D0003','Luis García','DOC003','70132222','E0003'),
('D0004','D0004','Carmen Rodríguez','DOC004','70145555','E0004'),
('D0005','D0005','Ernesto Castillo','DOC005','70158888','E0005');


-- Pacientes
INSERT INTO Paciente VALUES 
('P0001','P0001','Carlos Mendoza','78901111','carlos.mendoza@gmail.com',30,'01234567-8'),
('P0002','P0002','María López','78902222','maria.lopez@gmail.com',25,'02345678-9'),
('P0003','P0003','José Ramírez','78903333','jose.ramirez@gmail.com',40,'03456789-0'),
('P0004','P0004','Luisa Torres','78904444','luisa.torres@gmail.com',35,'04567890-1'),
('P0005','P0005','Ricardo Escobar','78905555','ricardo.escobar@gmail.com',28,'05678901-2'),
('P0006','P0006','Daniela Cruz','78906666','daniela.cruz@gmail.com',18,'06789012-3'),
('P0007','P0007','Mario Herrera','78907777','mario.herrera@gmail.com',50,'07890123-4');


-- Citas
INSERT INTO Cita VALUES 
('C0001','2025-09-28','09:00:00','Pendiente','P0001','D0001'),
('C0002','2025-09-29','10:30:00','Confirmada','P0002','D0002'),
('C0003','2025-09-29','11:00:00','Pendiente','P0003','D0002'),
('C0004','2025-09-30','14:00:00','Atendida','P0004','D0003'),
('C0005','2025-09-30','15:30:00','Cancelada','P0005','D0003'),
('C0006','2025-10-01','08:30:00','Pendiente','P0006','D0004'),
('C0007','2025-10-01','09:30:00','Confirmada','P0007','D0005'),
('C0008','2025-10-02','10:00:00','Pendiente','P0001','D0002'),
('C0009','2025-10-02','11:00:00','Pendiente','P0002','D0001'),
('C0010','2025-10-02','12:00:00','Pendiente','P0003','D0004');


-- Consultas
INSERT INTO Consulta VALUES 
('CO0001','El paciente presenta síntomas leves de gripe. Reposo y líquidos recomendados.','2025-09-30','C0004'),
('CO0002','Consulta de control prenatal. Todo en orden.','2025-09-30','C0005'),
('CO0003','Chequeo de rutina. Sin complicaciones.','2025-09-29','C0002'),
('CO0004','Se detectó problema cardíaco, se ordenaron exámenes adicionales.','2025-10-01','C0007'),
('CO0005','Tratamiento dermatológico aplicado. Revisión en dos semanas.','2025-10-02','C0010');


-- Horarios de Doctores
INSERT INTO Horario_Doctor VALUES 
('H0001','D0001','Lunes','08:00','12:00'),
('H0002','D0001','Miércoles','13:00','17:00'),
('H0003','D0002','Martes','08:30','12:30'),
('H0004','D0002','Jueves','14:00','18:00'),
('H0005','D0003','Lunes','09:00','13:00'),
('H0006','D0003','Viernes','10:00','14:00'),
('H0007','D0004','Martes','08:00','12:00'),
('H0008','D0004','Jueves','13:00','17:00'),
('H0009','D0005','Miércoles','09:00','13:00'),
('H0010','D0005','Viernes','14:00','18:00');


-- ==========================================
-- CONSULTAS DE VERIFICACIÓN
-- ==========================================
SELECT * FROM Usuario;
SELECT * FROM Especialidad;
SELECT * FROM Doctor;
SELECT * FROM Paciente;
SELECT * FROM Cita;
SELECT * FROM Consulta;