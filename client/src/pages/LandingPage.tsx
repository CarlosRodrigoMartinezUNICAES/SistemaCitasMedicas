import React, { useState } from "react";
import { Login } from "./Login";

const LandingPage: React.FC = () => {
  const [showLogin, setShowLogin] = useState(false);
  const [userType, setUserType] = useState<'Paciente' | 'Doctor' | null>(null);

  const handleCardClick = (type: 'Paciente' | 'Doctor') => {
    setUserType(type);
    setShowLogin(true);
  };

  if (showLogin && userType) {
    return <Login userType={userType} onBack={() => setShowLogin(false)} />;
  }

  return (
    <div className="container">
      <h1 className="title">Sistema de Citas Médicas</h1>
      <div className="cards-container">
        <div 
          className="card" 
          onClick={() => handleCardClick('Paciente')}
          role="button"
          tabIndex={0}
        >
          <h2>Paciente</h2>
          <p>Accede a tu cuenta como paciente</p>
        </div>
        <div 
          className="card" 
          onClick={() => handleCardClick('Doctor')}
          role="button"
          tabIndex={0}
        >
          <h2>Doctor</h2>
          <p>Accede a tu cuenta como doctor</p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;