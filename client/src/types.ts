export type Route =
  | { name: 'landing' }
  | { name: 'login'; tipo_usuario: 'Paciente' | 'Doctor' }
  | { name: 'paciente-citas'; id_usuario: string }
  | { name: 'paciente-historial'; id_usuario: string }
  | { name: 'paciente-perfil'; id_usuario: string }
  | { name: 'agendar-cita'; id_usuario: string }
  | { name: 'doctor-calendario'; id_usuario: string }
  | { name: 'doctor-citas'; id_usuario: string };

export type UsuarioTipo = 'Paciente' | 'Doctor';
