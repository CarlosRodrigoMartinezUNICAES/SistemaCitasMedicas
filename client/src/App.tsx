import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import PacienteCitas from "./pages/PacienteCitas";
import PacienteHistorialMedico from "./pages/PacienteHistorialMedico";
import PacientePerfil from "./pages/PacientePerfil";
import AgendarCita from "./pages/AgendarCita";
import Login from "./pages/Login";

type Route =
  | { name: 'landing' }
  | { name: 'login'; tipo_usuario: 'Paciente' | 'Doctor' }
  | { name: 'paciente-citas'; id_usuario: string }
  | { name: 'paciente-historial'; id_usuario: string }
  | { name: 'paciente-perfil'; id_usuario: string }
  | { name: 'agendar-cita'; id_usuario: string };

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ name: 'landing' });

  const handleLoginSuccess = (userId: string, tipo: string) => {
    console.log('handleLoginSuccess called with', { userId, tipo });
    // userId is id_usuario from backend
    if (tipo === 'Paciente') {
      console.log('Routing to paciente-citas page for', userId);
      setRoute({ name: 'paciente-citas', id_usuario: userId });
    } else {
      // for now redirect back to landing for doctors
      console.log('Non-paciente login, routing to landing');
      setRoute({ name: 'landing' });
    }
  };

  const handlePacienteNavigate = (userId: string, page: 'citas' | 'historial' | 'perfil' | 'agendar') => {
    if (page === 'citas') setRoute({ name: 'paciente-citas', id_usuario: userId });
    if (page === 'historial') setRoute({ name: 'paciente-historial', id_usuario: userId });
    if (page === 'perfil') setRoute({ name: 'paciente-perfil', id_usuario: userId });
    if (page === 'agendar') setRoute({ name: 'agendar-cita', id_usuario: userId });
  };

  if (route.name === 'landing') return <LandingPage onNavigate={(r) => setRoute(r)} />;
  if (route.name === 'login') return <Login tipo_usuario={route.tipo_usuario} onBack={() => setRoute({ name: 'landing' })} onSuccess={handleLoginSuccess} />;
  if (route.name === 'paciente-citas') return <PacienteCitas id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
  if (route.name === 'paciente-historial') return <PacienteHistorialMedico id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
  if (route.name === 'paciente-perfil') return <PacientePerfil id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
  if (route.name === 'agendar-cita') return <AgendarCita id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'paciente-citas', id_usuario: route.id_usuario })} onCreated={(id) => { console.log('Cita creada', id); setRoute({ name: 'paciente-citas', id_usuario: route.id_usuario }); }} />;

  return null;
};

export default App;
