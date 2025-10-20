

import React, { useState, useEffect } from "react";
import { User, Stethoscope } from "lucide-react";

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 340,
  background: "linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)",
  borderRadius: 16,
  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.08)",
  margin: '8px auto',
  padding: '20px 12px',
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  textAlign: "center",
  border: "1px solid rgba(59, 130, 246, 0.1)",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative",
  overflow: "hidden"
};

const buttonStyle: React.CSSProperties = {
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "#fff",
  borderRadius: 10,
  padding: "10px 20px",
  border: "none",
  marginTop: 12,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.18)",
  position: "relative",
  overflow: "hidden"
};

type LandingProps = {
  onNavigate: (route: any) => void;
};

const LandingPage: React.FC<LandingProps> = ({ onNavigate }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const handleCardClick = (type: 'Paciente' | 'Doctor') => {
    onNavigate({ name: 'login', tipo_usuario: type });
  };

  const AnimatedCard: React.FC<{ 
    type: 'Paciente' | 'Doctor', 
    icon: React.ReactNode, 
    title: string, 
    description: string, 
    gradient: string,
    iconBg: string
  }> = ({ type, icon, title, description, gradient, iconBg }) => (
    <div 
      style={{
        ...cardStyle,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded 
          ? (hoveredCard === type ? 'translateY(-4px) scale(1.01)' : 'translateY(0) scale(1)')
          : 'translateY(30px) scale(0.95)',
        boxShadow: hoveredCard === type 
          ? '0 8px 20px rgba(59, 130, 246, 0.15)' 
          : '0 4px 16px rgba(59, 130, 246, 0.08)',
        border: hoveredCard === type 
          ? '1px solid rgba(59, 130, 246, 0.2)' 
          : '1px solid rgba(59, 130, 246, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={() => {
        setHoveredCard(type);
      }}
      onMouseLeave={() => {
        setHoveredCard(null);
      }}
    >
      {/* Animated background gradient */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '4px',
        background: gradient,
        borderRadius: '20px 20px 0 0'
      }} />
      
      <div style={{ 
        background: iconBg, 
        padding: 14, 
        borderRadius: "50%", 
        marginBottom: 14,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        transform: hoveredCard === type ? 'scale(1.1) rotate(5deg)' : 'scale(1) rotate(0deg)',
        boxShadow: hoveredCard === type 
          ? '0 4px 16px rgba(59, 130, 246, 0.25)' 
          : '0 2px 8px rgba(59, 130, 246, 0.12)'
      }}>
        {icon}
      </div>
      
      <h2 style={{ 
        fontSize: 19, 
        fontWeight: 700, 
        color: "#1e293b", 
        marginBottom: 10,
        background: gradient,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        {title}
      </h2>
      
      <p style={{ 
        color: "#64748b", 
        fontSize: 13, 
        marginBottom: 14, 
        lineHeight: 1.5 
      }}>
        {description}
      </p>
      

      
      <button 
        style={{
          ...buttonStyle,
          transform: hoveredCard === type ? 'scale(1.05)' : 'scale(1)',
          boxShadow: hoveredCard === type 
            ? '0 4px 16px rgba(59, 130, 246, 0.3)' 
            : '0 2px 8px rgba(59, 130, 246, 0.18)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={() => handleCardClick(type)}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
        }}
      >
        Acceder como {type}
      </button>
    </div>
  );

  return (
    <div style={{ 
      minHeight: "100vh", 
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)",
      display: "flex", 
      flexDirection: "column", 
      alignItems: "center", 
      justifyContent: "center",
      padding: "18px 4px",
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
        animation: 'float 20s ease-in-out infinite',
        pointerEvents: 'none'
      }} />
      
      <div style={{
        position: 'absolute',
        top: '10%',
        right: '10%',
        width: '200px',
        height: '200px',
        background: 'linear-gradient(45deg, rgba(34, 197, 94, 0.1), rgba(59, 130, 246, 0.05))',
        borderRadius: '50%',
        animation: 'pulse 4s ease-in-out infinite'
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '20%',
        left: '5%',
        width: '150px',
        height: '150px',
        background: 'linear-gradient(45deg, rgba(59, 130, 246, 0.08), rgba(34, 197, 94, 0.03))',
        borderRadius: '50%',
        animation: 'pulse 6s ease-in-out infinite reverse'
      }} />

      {/* Header */}
      <div style={{ 
        textAlign: "center", 
        marginBottom: 24,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(-30px)',
        transition: 'all 0.8s ease'
      }}>
        <h1 style={{ 
          fontSize: 32, 
          fontWeight: 800, 
          color: "#1e293b",
          marginBottom: 10,
          textShadow: '0 2px 10px rgba(59, 130, 246, 0.1)',
          letterSpacing: '-0.02em'
        }}>
          Sistema de Citas Clínicas
        </h1>
        <p style={{ 
          color: "#475569", 
          fontSize: 15,
          fontWeight: 400,
          maxWidth: '90%',
          margin: '0 auto',
          textShadow: '0 1px 5px rgba(59, 130, 246, 0.1)'
        }}>
          Gestión integral y moderna de citas médicas para clínicas
        </p>
      </div>

      {/* Main Cards Container - Horizontal Layout */}
      <div style={{ 
        display: "flex", 
        gap: 8, 
        justifyContent: "center", 
        flexWrap: "wrap",
        maxWidth: '100%',
        width: '100%',
        marginBottom: 32,
        padding: '0 8px'
      }}>
        <AnimatedCard
          type="Paciente"
          icon={<User size={36} color="#ffffff" />}
          title="Panel de Paciente"
          description="Gestiona tus citas médicas de forma sencilla y eficiente"
          gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
          iconBg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        />
        
        <AnimatedCard
          type="Doctor"
          icon={<Stethoscope size={36} color="#ffffff" />}
          title="Panel Médico"
          description="Administra citas, pacientes y consultas médicas"
          gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
          iconBg="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
        />
      </div>



      {/* Registration Section */}
      <div style={{
        textAlign: 'center',
        marginTop: 24,
        marginBottom: 32,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(20px)',
        transition: 'all 0.8s ease 0.4s'
      }}>
        <p style={{
          color: '#475569',
          marginBottom: 12,
          fontSize: 14
        }}>
          ¿No tienes una cuenta?
        </p>
        <button 
          onClick={() => onNavigate({ name: 'register' })}
          style={{
            ...buttonStyle,
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '10px 24px',
            fontSize: 14,
            transition: 'all 0.3s ease',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
e.currentTarget.style.background = 'linear-gradient(135deg, #059669 0%, #047857 100%)';
e.currentTarget.style.transform = 'scale(1.05)';
}}
onMouseLeave={(e: React.MouseEvent<HTMLButtonElement>) => {
e.currentTarget.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
e.currentTarget.style.transform = 'scale(1)';
}}
>
Regístrate ahora
</button>
</div>

<style>{`
@keyframes float {
0%, 100% { transform: translateY(0px) rotate(0deg); }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;