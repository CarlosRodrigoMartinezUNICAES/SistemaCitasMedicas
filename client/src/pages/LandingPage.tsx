

import React, { useState, useEffect } from "react";
import { User, Stethoscope, CalendarDays, Users, BarChart3 } from "lucide-react";

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
  const [hoveredFeature, setHoveredFeature] = useState<number | null>(null);

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
    features: string[],
    gradient: string,
    iconBg: string
  }> = ({ type, icon, title, description, features, gradient, iconBg }) => (
    <div 
      style={{
        ...cardStyle,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded 
          ? (hoveredCard === type ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)')
          : 'translateY(30px) scale(0.95)',
        boxShadow: hoveredCard === type 
          ? '0 10px 25px rgba(59, 130, 246, 0.18)' 
          : '0 4px 16px rgba(59, 130, 246, 0.08)',
        border: hoveredCard === type 
          ? '2px solid rgba(59, 130, 246, 0.3)' 
          : '1px solid rgba(59, 130, 246, 0.1)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
      }}
      onMouseEnter={() => {
        console.log('Hovering card:', type);
        setHoveredCard(type);
      }}
      onMouseLeave={() => {
        console.log('Leaving card:', type);
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
      
      <ul style={{ 
        color: "#475569", 
        fontSize: 12, 
        marginBottom: 18, 
        textAlign: "left", 
        listStyle: "none",
        padding: 0
      }}>
        {features.map((feature, index) => (
          <li key={index} style={{
            marginBottom: 6,
            paddingLeft: 16,
            position: 'relative',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: hoveredCard === type ? 'translateX(5px)' : 'translateX(0)',
            transitionDelay: hoveredCard === type ? `${index * 0.05}s` : '0s'
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: gradient,
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              transform: hoveredCard === type ? 'translateY(-50%) scale(1.2)' : 'translateY(-50%) scale(1)'
            }} />
            {feature}
          </li>
        ))}
      </ul>
      
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
          e.currentTarget.style.transform = 'scale(1.05)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)';
          e.currentTarget.style.transform = hoveredCard === type ? 'scale(1.05)' : 'scale(1)';
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
        gap: 16, 
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
          features={[
            "Agendar nueva cita",
            "Ver historial de citas", 
            "Consultar especialidades",
            "Gestionar información personal"
          ]}
          gradient="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
          iconBg="linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)"
        />
        
        <AnimatedCard
          type="Doctor"
          icon={<Stethoscope size={36} color="#ffffff" />}
          title="Panel Médico"
          description="Administra citas, pacientes y consultas médicas"
          features={[
            "Calendario de citas",
            "Gestión de pacientes",
            "Reportes y estadísticas", 
            "Historial de consultas"
          ]}
          gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
          iconBg="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
        />
      </div>

      {/* Features Section */}
      <div style={{ 
        display: "grid", 
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", 
        gap: 16, 
        maxWidth: '90%', 
        width: '100%',
        textAlign: "center",
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'translateY(0)' : 'translateY(30px)',
        transition: 'all 0.8s ease 0.3s'
      }}>
        {[
          { icon: <CalendarDays size={24} color="#3b82f6" />, title: "Gestión de Citas", desc: "Sistema completo para agendar y administrar citas médicas" },
          { icon: <Users size={24} color="#22c55e" />, title: "Control de Pacientes", desc: "Registro y seguimiento del historial médico de pacientes" },
          { icon: <BarChart3 size={24} color="#3b82f6" />, title: "Reportes y Análisis", desc: "Estadísticas y reportes para mejorar la gestión clínica" }
        ].map((feature, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            padding: 14,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            transform: hoveredFeature === index ? 'translateY(-5px)' : 'translateY(0)',
            boxShadow: hoveredFeature === index 
              ? '0 4px 16px rgba(59, 130, 246, 0.18)' 
              : '0 2px 8px rgba(59, 130, 246, 0.08)',
            border: hoveredFeature === index 
              ? '1px solid rgba(59, 130, 246, 0.2)' 
              : '1px solid rgba(59, 130, 246, 0.08)'
          }}
          onMouseEnter={() => {
            console.log('Hovering feature:', index);
            setHoveredFeature(index);
          }}
          onMouseLeave={() => {
            console.log('Leaving feature:', index);
            setHoveredFeature(null);
          }}
          >
            <div style={{ marginBottom: 10 }}>
              {feature.icon}
            </div>
            <h3 style={{ 
              fontWeight: 600, 
              color: "#1e293b", 
              fontSize: 15,
              marginBottom: 8
            }}>
              {feature.title}
            </h3>
            <p style={{ 
              color: "#475569", 
              fontSize: 12, 
              lineHeight: 1.5
            }}>
              {feature.desc}
            </p>
          </div>
        ))}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default LandingPage;