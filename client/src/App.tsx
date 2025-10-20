import React, { useState, Component, ReactNode, useRef, useMemo } from "react";
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
import type { Route } from './types';

class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: any}> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }
  render() {
    if (this.state.hasError) {
      return <div style={{background:'red',color:'white',padding:'2rem'}}>
        <h2>App crashed!</h2>
        <pre>{String(this.state.error)}</pre>
      </div>;
    }
    return this.props.children;
  }
}

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
        return 'unknown';
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
    try {
      console.log('renderPage route:', route);
      switch (route.name) {
        case 'landing':
          return <div style={{background: 'rgba(255,0,0,0.1)', border: '2px solid red'}}><span>DEBUG: LandingPage</span><LandingPage onNavigate={(route) => setRoute(route)} /></div>;
        case 'login':
          return <div style={{background: 'rgba(0,0,255,0.1)', border: '2px solid blue'}}><span>DEBUG: LoginPage</span><Login tipo_usuario={route.tipo_usuario} onBack={() => setRoute({ name: 'landing' })} onSuccess={handleLoginSuccess} /></div>;
        case 'paciente-citas':
          return <div style={{background: 'rgba(0,255,0,0.1)', border: '2px solid green'}}><span>DEBUG: PacienteCitas</span><PacienteCitas id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} /></div>;
        case 'paciente-historial':
          return <div style={{background: 'rgba(255,255,0,0.1)', border: '2px solid orange'}}><span>DEBUG: PacienteHistorialMedico</span><PacienteHistorialMedico id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} /></div>;
        case 'paciente-perfil':
          return <div style={{background: 'rgba(255,0,255,0.1)', border: '2px solid purple'}}><span>DEBUG: PacientePerfil</span><PacientePerfil id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handlePacienteNavigate(route.id_usuario, page)} /></div>;
        case 'agendar-cita':
          return <div style={{background: 'rgba(0,255,255,0.1)', border: '2px solid cyan'}}><span>DEBUG: AgendarCita</span><AgendarCita id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'paciente-citas', id_usuario: route.id_usuario })} onCreated={(id) => { console.log('Cita creada', id); setRoute({ name: 'paciente-citas', id_usuario: route.id_usuario }); }} /></div>;
        case 'doctor-calendario':
          return <div style={{background: 'rgba(128,0,128,0.1)', border: '2px solid magenta'}}><span>DEBUG: DoctorCalendario</span><DoctorCalendario id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handleDoctorNavigate(route.id_usuario, page)} /></div>;
        case 'doctor-citas':
          return <div style={{background: 'rgba(128,128,0,0.1)', border: '2px solid olive'}}><span>DEBUG: DoctorCitas</span><DoctorCitas id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} onNavigate={(page) => handleDoctorNavigate(route.id_usuario, page)} /></div>;
        default:
          return <div style={{background: 'rgba(0,0,0,0.1)', border: '2px solid black', color: 'black'}}><span>DEBUG: No page rendered for route: {JSON.stringify(route)}</span></div>;
      }
    } catch (err) {
      console.error('renderPage error:', err);
      return <div style={{background:'red',color:'white',padding:'2rem'}}>
        <h2>renderPage crashed!</h2>
        <pre>{String(err)}</pre>
      </div>;
    }
  };

  // Use a unique nodeRef per route key to avoid transition flash
  const nodeRefs = useMemo(() => ({} as Record<string, React.RefObject<HTMLDivElement | null>>), []);
  const routeKey = getRouteKey(route);
  if (!nodeRefs[routeKey]) {
  nodeRefs[routeKey] = React.createRef<HTMLDivElement>();
  }
  const nodeRef = nodeRefs[routeKey];
  return (
    <ErrorBoundary>
      <div className="transition-container">
        <TransitionGroup component={null}>
          <CSSTransition
            key={routeKey}
            timeout={400}
            classNames="page-transition"
            nodeRef={nodeRef}
          >
            <div ref={nodeRef} style={{ width: '100%', minHeight: '100vh' }}>{renderPage()}</div>
          </CSSTransition>
        </TransitionGroup>
      </div>
    </ErrorBoundary>
  );
};

export default App;
