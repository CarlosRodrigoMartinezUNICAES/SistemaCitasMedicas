


import React from "react";
import { User, Stethoscope, CalendarDays, Users, BarChart3 } from "lucide-react";

const cardStyle: React.CSSProperties = {
  width: 320,
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  margin: 8,
  padding: 24,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center"
};
const buttonStyle: React.CSSProperties = {
  background: "#222",
  color: "#fff",
  borderRadius: 6,
  padding: "10px 24px",
  border: "none",
  marginTop: 12,
  cursor: "pointer"
};

type LandingProps = {
  onNavigate: (route: any) => void;
};

const LandingPage: React.FC<LandingProps> = ({ onNavigate }) => {
  const handleCardClick = (type: 'Paciente' | 'Doctor') => {
    // instead of local state navigation, call parent
    onNavigate({ name: 'login', tipo_usuario: type });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", flexDirection: "column", alignItems: "center", padding: "48px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <h1 style={{ fontSize: 32, fontWeight: 600, color: "#1e293b" }}>Sistema de Citas Clínicas</h1>
        <p style={{ color: "#64748b", marginTop: 8 }}>
          Gestión integral de citas médicas para clínicas
        </p>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, marginBottom: 56, maxWidth: 700 }}>
        <div style={{ display: "flex", flexDirection: "row", gap: 32, justifyContent: "center", flexWrap: "wrap" }}>
          {/* Panel Paciente */}
          <div style={cardStyle}>
            <div style={{ background: "#dbeafe", padding: 16, borderRadius: "50%", marginBottom: 16 }}>
              <User size={32} color="#3b82f6" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b" }}>Panel de Paciente</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
              Agenda tus citas médicas y consulta tu historial
            </p>
            <ul style={{ color: "#475569", fontSize: 14, marginBottom: 24, textAlign: "left", listStyle: "disc inside" }}>
              <li>Agendar nueva cita</li>
              <li>Ver historial de citas</li>
              <li>Consultar especialidades</li>
              <li>Gestionar información personal</li>
            </ul>
            <button style={buttonStyle} onClick={() => handleCardClick('Paciente')}>
              Acceder como Paciente
            </button>
          </div>
          {/* Panel Médico */}
          <div style={cardStyle}>
            <div style={{ background: "#bbf7d0", padding: 16, borderRadius: "50%", marginBottom: 16 }}>
              <Stethoscope size={32} color="#22c55e" />
            </div>
            <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b" }}>Panel Médico</h2>
            <p style={{ color: "#64748b", fontSize: 14, marginBottom: 16 }}>
              Administra citas, pacientes y consultas médicas
            </p>
            <ul style={{ color: "#475569", fontSize: 14, marginBottom: 24, textAlign: "left", listStyle: "disc inside" }}>
              <li>Calendario de citas</li>
              <li>Gestión de pacientes</li>
              <li>Reportes y estadísticas</li>
              <li>Historial de consultas</li>
            </ul>
            <button style={buttonStyle} onClick={() => handleCardClick('Doctor')}>
              Acceder como Doctor
            </button>
          </div>
        </div>
      </div>
      {/* Sección inferior con iconos */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 32, maxWidth: 900, textAlign: "center" }}>
        <div>
          <CalendarDays style={{ margin: "0 auto 8px", color: "#334155" }} size={24} />
          <h3 style={{ fontWeight: 600, color: "#1e293b" }}>Gestión de Citas</h3>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
            Sistema completo para agendar y administrar citas médicas
          </p>
        </div>
        <div>
          <Users style={{ margin: "0 auto 8px", color: "#334155" }} size={24} />
          <h3 style={{ fontWeight: 600, color: "#1e293b" }}>Control de Pacientes</h3>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
            Registro y seguimiento del historial médico de pacientes
          </p>
        </div>
        <div>
          <BarChart3 style={{ margin: "0 auto 8px", color: "#334155" }} size={24} />
          <h3 style={{ fontWeight: 600, color: "#1e293b" }}>Reportes y Análisis</h3>
          <p style={{ color: "#64748b", fontSize: 14, marginTop: 4 }}>
            Estadísticas y reportes para mejorar la gestión clínica
          </p>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;