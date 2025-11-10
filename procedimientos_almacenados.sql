DELIMITER //

-- 1. Procedimiento para Registrar un Nuevo Paciente
-- Este procedimiento registra un nuevo usuario de tipo 'Paciente' y su información asociada en la tabla Paciente.
-- Reemplaza la lógica de creación de usuario y paciente que podría estar en un endpoint de registro.
CREATE PROCEDURE RegistrarPaciente(
    IN p_username VARCHAR(50),
    IN p_password_hash VARCHAR(100),
    IN p_nombre_completo VARCHAR(100),
    IN p_telefono VARCHAR(15),
    IN p_correo VARCHAR(100),
    IN p_edad INT,
    IN p_dui VARCHAR(10),
    OUT p_id_paciente_generado VARCHAR(10),
    OUT p_mensaje VARCHAR(255)
)
BEGIN
    DECLARE v_next_user_id_num INT;
    DECLARE v_next_paciente_id_num INT;
    DECLARE v_id_usuario VARCHAR(10);
    DECLARE v_id_paciente VARCHAR(10);

    -- Validar campos obligatorios
    IF p_username IS NULL OR p_password_hash IS NULL OR p_nombre_completo IS NULL OR p_telefono IS NULL OR p_correo IS NULL OR p_edad IS NULL OR p_dui IS NULL THEN
        SET p_mensaje = 'Error: Todos los campos son obligatorios.';
    ELSE
        -- Generar el próximo id_usuario (PXXXX)
        SELECT IFNULL(MAX(CAST(SUBSTRING(id_usuario, 2) AS UNSIGNED)), 0) + 1 INTO v_next_user_id_num FROM Usuario WHERE tipo_usuario = 'Paciente';
        SET v_id_usuario = CONCAT('P', LPAD(v_next_user_id_num, 4, '0'));

        -- Generar el próximo id_paciente (PXXXX)
        SELECT IFNULL(MAX(CAST(SUBSTRING(id_paciente, 2) AS UNSIGNED)), 0) + 1 INTO v_next_paciente_id_num FROM Paciente;
        SET v_id_paciente = CONCAT('P', LPAD(v_next_paciente_id_num, 4, '0'));

        -- Insertar en la tabla Usuario
        INSERT INTO Usuario (id_usuario, tipo_usuario, username, password_hash)
        VALUES (v_id_usuario, 'Paciente', p_username, p_password_hash);

        -- Insertar en la tabla Paciente
        INSERT INTO Paciente (id_paciente, id_usuario, nombre_completo, telefono, correo, edad, dui)
        VALUES (v_id_paciente, v_id_usuario, p_nombre_completo, p_telefono, p_correo, p_edad, p_dui);

        SET p_id_paciente_generado = v_id_paciente;
        SET p_mensaje = 'Paciente registrado exitosamente.';
    END IF;
END //

-- 2. Procedimiento para Obtener Citas de un Doctor por Fecha
-- Este procedimiento devuelve todas las citas agendadas para un doctor específico en una fecha dada,
-- incluyendo detalles del paciente. Reemplaza la lógica de consulta de citas de doctor.
CREATE PROCEDURE ObtenerCitasDoctorPorFecha(
    IN p_id_doctor VARCHAR(10),
    IN p_fecha DATE
)
BEGIN
    SELECT
        c.id_cita,
        c.hora,
        c.estado,
        p.id_paciente,
        p.nombre_completo AS nombre_paciente,
        p.telefono AS telefono_paciente,
        p.correo AS correo_paciente
    FROM
        Cita c
    JOIN
        Paciente p ON c.id_paciente = p.id_paciente
    WHERE
        c.id_doctor = p_id_doctor AND c.fecha = p_fecha
    ORDER BY
        c.hora;
END //

-- 3. Procedimiento para Obtener el Historial Médico de un Paciente
-- Este procedimiento recupera todas las consultas realizadas para un paciente,
-- incluyendo detalles de la cita, el doctor y la especialidad.
-- Reemplaza la lógica de consulta de historial médico en el endpoint de paciente.
CREATE PROCEDURE ObtenerHistorialMedicoPaciente(
    IN p_id_paciente VARCHAR(10)
)
BEGIN
    SELECT
        co.id_consulta,
        co.reporte_paciente,
        co.fecha_consulta,
        c.id_cita,
        c.fecha AS fecha_cita,
        c.hora AS hora_cita,
        d.nombre_completo AS nombre_doctor,
        e.nombre AS especialidad_doctor
    FROM
        Consulta co
    JOIN
        Cita c ON co.id_cita = c.id_cita
    JOIN
        Doctor d ON c.id_doctor = d.id_doctor
    JOIN
        Especialidad e ON d.id_especialidad = e.id_especialidad
    WHERE
        c.id_paciente = p_id_paciente
    ORDER BY
        co.fecha_consulta DESC, c.hora DESC;
END //

DELIMITER ;