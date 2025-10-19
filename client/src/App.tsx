import React, { useState } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";
import LandingPage from "./pages/LandingPage";
import PacienteCitas from "./pages/PacienteCitas";
import PacienteHistorialMedico from "./pages/PacienteHistorialMedico";
import PacientePerfil from "./pages/PacientePerfil";
import AgendarCita from "./pages/AgendarCita";
import Login from "./pages/Login";
import DoctorCalendario from "./pages/DoctorCalendario";
import DoctorCitas from "./pages/DoctorCitas";
import "./App.css";

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

  const getRouteKey = (route: Route): string => {
    switch (route.name) {
      case 'landing':
        return 'landing';
      case 'login':
        return `login-${route.tipo_usuario}`;
      case 'paciente-citas':
        return `${route.name}-${route.id_usuario}`;
      case 'paciente-historial':
        return `${route.name}-${route.id_usuario}`;
      case 'paciente-perfil':
        return `${route.name}-${route.id_usuario}`;
      case 'agendar-cita':
        return `${route.name}-${route.id_usuario}`;
      case 'doctor-calendario':
        return `${route.name}-${route.id_usuario}`;
      case 'doctor-citas':
        return `${route.name}-${route.id_usuario}`;
      default:
        return route.name;
    }
  };

  const handleLoginSuccess = (userId: string, tipo: string) => {
    console.log('handleLoginSuccess called with', { userId, tipo });
    if (tipo === 'Paciente') {
      console.log('Routing to paciente-citas page for', userId);
      setRoute({ name: 'paciente-citas', id_usuario: userId });
    } else if (tipo === 'Doctor') {
      console.log('Routing to doctor-calendario page for', userId);
      setRoute({ name: 'doctor-calendario', id_usuario: userId });
    } else {
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
  };

  const renderPage = () => {
    switch (route.name) {
      case 'landing':
        return <LandingPage onNavigate={(r) => setRoute(r)} />;
      case 'login':
        return <Login tipo_usuario={route.tipo_usuario} onBack={() => setRoute({ name: 'landing' })} onSuccess={handleLoginSuccess} />;
      case 'paciente-citas':
        return <PacienteCitas id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
      case 'paciente-historial':
        return <PacienteHistorialMedico id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
      case 'paciente-perfil':
        return <PacientePerfil id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} />;
      case 'agendar-cita':
        return <AgendarCita id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'paciente-citas', id_usuario: route.id_usuario })} onCreated={(id) => { console.log('Cita creada', id); setRoute({ name: 'paciente-citas', id_usuario: route.id_usuario }); }} />;
      case 'doctor-calendario':
        return <DoctorCalendario id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handleDoctorNavigate(route.id_usuario, page)} />;
      case 'doctor-citas':
        return <DoctorCitas id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handleDoctorNavigate(route.id_usuario, page)} />;
      default:
        return null;
    }
  };

  return (
    <div className="transition-container">
      <TransitionGroup component={null}>
        <CSSTransition
          key={getRouteKey(route)}
          timeout={400}
          classNames="page-transition"
          unmountOnExit
        >
          <div style={{ width: '100%' }}>{renderPage()}</div>
        </CSSTransition>
      </TransitionGroup>
    </div>
  );
};

export default App;
