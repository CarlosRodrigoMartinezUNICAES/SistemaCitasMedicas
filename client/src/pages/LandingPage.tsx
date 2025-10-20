

import React, { useState, useEffect } from "react";
import { User, Stethoscope, HeartPulse, Syringe, Pill, Microscope, Ambulance } from "lucide-react";

const cardStyle: React.CSSProperties = {
  width: '100%',
  maxWidth: 340,
  background: "linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)",
  borderRadius: 16,
  boxShadow: "0 4px 16px rgba(59, 130, 246, 0.08)",
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
  padding: "8px 18px",
  border: "none",
  marginTop: 'auto',
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 14,
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.18)",
  position: "relative",
  overflow: "hidden"
};

const ScatteredIcon: React.FC<{

  Icon: React.ElementType;

  size: number;

  top: string;

  left?: string;

  right?: string;

  bottom?: string;

  animationDuration: string;

  delay: string;

  opacity: number;

  color: string;

}> = ({ Icon, size, top, left, right, bottom, animationDuration, delay, opacity, color }) => (

  <div

    style={{

      position: "absolute",

      top,

      left,

      right,

      bottom,

      fontSize: size,

      color,

      opacity,

      animation: `floatIcon ${animationDuration} ease-in-out ${delay} infinite alternate`,

      pointerEvents: "none",

      zIndex: 0,

    }}

  >

    <Icon size={size} />

  </div>

);



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

                  {/* Scattered Medical Icons */}
                  <ScatteredIcon Icon={HeartPulse} size={55} top="10%" left="5%" animationDuration="12s" delay="0s" opacity={0.4} color="#3b82f6" />
                  <ScatteredIcon Icon={Syringe} size={45} top="20%" right="10%" animationDuration="15s" delay="2s" opacity={0.35} color="#3b82f6" />
                  <ScatteredIcon Icon={Pill} size={50} bottom="15%" left="15%" animationDuration="13s" delay="4s" opacity={0.45} color="#3b82f6" />
                  <ScatteredIcon Icon={Microscope} size={60} top="5%" right="20%" animationDuration="17s" delay="6s" opacity={0.38} color="#3b82f6" />
                  <ScatteredIcon Icon={Ambulance} size={65} bottom="5%" right="5%" animationDuration="14s" delay="8s" opacity={0.43} color="#3b82f6" />
                  <ScatteredIcon Icon={Stethoscope} size={53} top="30%" left="25%" animationDuration="16s" delay="1s" opacity={0.4} color="#3b82f6" />
                  <ScatteredIcon Icon={User} size={47} bottom="25%" left="30%" animationDuration="11s" delay="3s" opacity={0.33} color="#3b82f6" />
                  <ScatteredIcon Icon={HeartPulse} size={57} top="40%" right="15%" animationDuration="14s" delay="5s" opacity={0.47} color="#3b82f6" />
                  <ScatteredIcon Icon={Syringe} size={52} bottom="10%" right="25%" animationDuration="12s" delay="7s" opacity={0.38} color="#3b82f6" />
                  <ScatteredIcon Icon={Pill} size={63} top="15%" left="40%" animationDuration="18s" delay="9s" opacity={0.4} color="#3b82f6" />

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

@keyframes floatIcon {

  0% { transform: translateY(0px); }

  25% { transform: translateY(-25px); }

  50% { transform: translateY(-25px); }

  75% { transform: translateY(0px); }

  100% { transform: translateY(0px); }

}

`}</style>

    </div>
  );
};

export default LandingPage;