export type Route =
  | { name: 'landing' }
  | { name: 'login'; tipo_usuario: 'Paciente' | 'Doctor' }
  | { name: 'register' }
  | { name: 'paciente-citas'; id_usuario: string; nombre_completo?: string }
  | { name: 'paciente-historial'; id_usuario: string; nombre_completo?: string }
  | { name: 'paciente-perfil'; id_usuario: string; nombre_completo?: string }
  | { name: 'agendar-cita'; id_usuario: string }
  | { name: 'doctor-calendario'; id_usuario: string; nombre_completo?: string }
  | { name: 'doctor-citas'; id_usuario: string; nombre_completo?: string }
  | { name: 'doctor-pacientes'; id_usuario: string; nombre_completo?: string }
  | { name: 'doctor-reportes'; id_usuario: string; nombre_completo?: string };

export type UsuarioTipo = 'Paciente' | 'Doctor';
