import React, { useState } from "react";
import LandingPage from "./pages/LandingPage";
import PacientePage from "./pages/PacientePage";
import Login from "./pages/Login";

type Route =
  | { name: 'landing' }
  | { name: 'login'; tipo_usuario: 'Paciente' | 'Doctor' }
  | { name: 'paciente'; id_usuario: string };

const App: React.FC = () => {
  const [route, setRoute] = useState<Route>({ name: 'landing' });

  const handleLoginSuccess = (userId: string, tipo: string) => {
    console.log('handleLoginSuccess called with', { userId, tipo });
    // userId is id_usuario from backend
    if (tipo === 'Paciente') {
      console.log('Routing to paciente page for', userId);
      setRoute({ name: 'paciente', id_usuario: userId });
    } else {
      // for now redirect back to landing for doctors
      console.log('Non-paciente login, routing to landing');
      setRoute({ name: 'landing' });
    }
  };

  if (route.name === 'landing') return <LandingPage onNavigate={(r) => setRoute(r)} />;
  if (route.name === 'login') return <Login tipo_usuario={route.tipo_usuario} onBack={() => setRoute({ name: 'landing' })} onSuccess={handleLoginSuccess} />;
  if (route.name === 'paciente') return <PacientePage id_usuario={route.id_usuario} onBack={() => setRoute({ name: 'landing' })} />;

  return null;
};

export default App;
