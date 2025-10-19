import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import PacienteCitas from "./pages/PacienteCitas";
import PacienteHistorialMedico from "./pages/PacienteHistorialMedico";
import PacientePerfil from "./pages/PacientePerfil";
import AgendarCita from "./pages/AgendarCita";
import Login from "./pages/Login";
import DoctorCalendario from "./pages/DoctorCalendario";
import DoctorCitas from "./pages/DoctorCitas";

type Route =
  | { name: 'landing' }
  | { name: 'login'; tipo_usuario: 'Paciente' | 'Doctor' }
  | { name: 'paciente-citas'; id_usuario: string }
  | { name: 'paciente-historial'; id_usuario: string }
  | { name: 'paciente-perfil'; id_usuario: string }
  | { name: 'agendar-cita'; id_usuario: string }
  | { name: 'doctor-calendario'; id_usuario: string }
  | { name: 'doctor-citas'; id_usuario: string };

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ name: 'landing' });

  const handleLoginSuccess = (userId: string, tipo: string) => {
    console.log('handleLoginSuccess called with', { userId, tipo });
    // userId is id_usuario from backend
    if (tipo === 'Paciente') {
      console.log('Routing to paciente-citas page for', userId);
      setRoute({ name: 'paciente-citas', id_usuario: userId });
    } else if (tipo === 'Doctor') {
      console.log('Routing to doctor-calendario page for', userId);
      setRoute({ name: 'doctor-calendario', id_usuario: userId });
    } else {
      // fallback to landing
      console.log('Unknown user type, routing to landing');
      setRoute({ name: 'landing' });
    }
  };

  const handlePacienteNavigate = (userId: string, page: 'citas' | 'historial' | 'perfil' | 'agendar') => {
    if (page === 'citas') setRoute({ name: 'paciente-citas', id_usuario: userId });
    if (page === 'historial') setRoute({ name: 'paciente-historial', id_usuario: userId });
    if (page === 'perfil') setRoute({ name: 'paciente-perfil', id_usuario: userId });
    if (page === 'agendar') setRoute({ name: 'agendar-cita', id_usuario: userId });
  };

  const handleDoctorNavigate = (userId: string, page: 'calendario' | 'citas' | 'pacientes' | 'reportes') => {
    if (page === 'calendario') setRoute({ name: 'doctor-calendario', id_usuario: userId });
    if (page === 'citas') setRoute({ name: 'doctor-citas', id_usuario: userId });
    // TODO: Add other doctor pages as they are created
    // if (page === 'pacientes') setRoute({ name: 'doctor-pacientes', id_usuario: userId });
    // if (page === 'reportes') setRoute({ name: 'doctor-reportes', id_usuario: userId });
  };

  if (route.name === 'landing') return <LandingPage onNavigate={(r) => setRoute(r)} />;
  if (route.name === 'login') return <Login tipo_usuario={route.tipo_usuario} onBack={() => setRoute({ name: 'landing' })} onSuccess={handleLoginSuccess} />;
  if (route.name === 'paciente-citas') return <PacienteCitas id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
  if (route.name === 'paciente-historial') return <PacienteHistorialMedico id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
  if (route.name === 'paciente-perfil') return <PacientePerfil id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
  if (route.name === 'agendar-cita') return <AgendarCita id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'paciente-citas', id_usuario: route.id_usuario })} onCreated={(id) => { console.log('Cita creada', id); setRoute({ name: 'paciente-citas', id_usuario: route.id_usuario }); }} />;
  if (route.name === 'doctor-calendario') return <DoctorCalendario id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handleDoctorNavigate(route.id_usuario, page)} />;
  if (route.name === 'doctor-citas') return <DoctorCitas id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handleDoctorNavigate(route.id_usuario, page)} />;

  return null;
};

export default App;
