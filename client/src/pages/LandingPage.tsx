import React, { useState, useEffect, useRef } from "react";
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
  padding: "12px 24px", // Increased padding
  border: "none",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 16, // Increased font size
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.18)",
  position: "relative",
  overflow: "hidden",
  width: "fit-content", // Fit to content horizontally
};

type AnimatedCardProps = {
  type: 'Paciente' | 'Doctor';
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  iconBg: string;
  isLoaded: boolean;
  hoveredCard: string | null;
  setHoveredCard: React.Dispatch<React.SetStateAction<string | null>>;
  handleCardClick: (type: 'Paciente' | 'Doctor') => void;
};

const AnimatedCard: React.FC<AnimatedCardProps> = ({
  type, icon, title, description, gradient, iconBg,
  isLoaded, hoveredCard, setHoveredCard, handleCardClick
}) => {
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  const defaultButtonBackground = type === 'Paciente'
    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
    : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)';

  const hoverButtonBackground = type === 'Paciente'
    ? 'linear-gradient(135deg, #1d4ed8 0%, #3b82f6 100%)'
    : 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)';

  return (
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
          background: isButtonHovered ? hoverButtonBackground : defaultButtonBackground,
          transform: isButtonHovered ? 'scale(1.05)' : 'scale(1)',
          boxShadow: isButtonHovered
            ? '0 4px 16px rgba(59, 130, 246, 0.3)'
            : '0 2px 8px rgba(59, 130, 246, 0.18)',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        }}
        onClick={() => handleCardClick(type)}
        onMouseEnter={() => setIsButtonHovered(true)}
        onMouseLeave={() => setIsButtonHovered(false)}
      >
        Acceder como {type}
      </button>
    </div>
  );
};

type LandingProps = {
  onNavigate: (route: any) => void;
};

const LandingPage: React.FC<LandingProps> = ({ onNavigate }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const ScatteredParallaxIcon: React.FC<{
    Icon: React.ElementType;
    size: number;
    top?: string;
    left?: string;
    right?: string;
    bottom?: string;
    opacity: number;
    color: string;
    parallaxStrength: number;
  }> = ({ Icon, size, top, left, right, bottom, opacity, color, parallaxStrength }) => (
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
        pointerEvents: "none",
        zIndex: 0,
        transform: `translate3d(${-mouseX * parallaxStrength}px, ${-mouseY * parallaxStrength}px, 0)`,
        transition: "transform 0.1s ease-out",
      }}
    >
      <Icon size={size} />
    </div>
  );

  useEffect(() => {
    setIsLoaded(true);

    const handleMouseMove = (event: MouseEvent) => {
      if (containerRef.current) {
        const { clientX, clientY } = event;
        const { offsetWidth, offsetHeight } = containerRef.current;
        const centerX = offsetWidth / 2;
        const centerY = offsetHeight / 2;

        const newMouseX = (clientX - centerX) / centerX;
        const newMouseY = (clientY - centerY) / centerY;

        setMouseX(newMouseX);
        setMouseY(newMouseY);
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const handleCardClick = (type: 'Paciente' | 'Doctor') => {
    onNavigate({ name: 'login', tipo_usuario: type });
  };

  return (
    <div
      ref={containerRef}
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "18px 4px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Scattered Medical Icons with Parallax */}
      <ScatteredParallaxIcon Icon={HeartPulse} size={55} top="10%" left="5%" opacity={0.4} color="#3b82f6" parallaxStrength={15} />
      <ScatteredParallaxIcon Icon={Syringe} size={45} top="20%" right="10%" opacity={0.35} color="#3b82f6" parallaxStrength={10} />
      <ScatteredParallaxIcon Icon={Pill} size={50} bottom="15%" left="15%" opacity={0.45} color="#3b82f6" parallaxStrength={20} />
      <ScatteredParallaxIcon Icon={Microscope} size={60} top="5%" right="20%" opacity={0.38} color="#3b82f6" parallaxStrength={12} />
      <ScatteredParallaxIcon Icon={Ambulance} size={65} bottom="5%" right="5%" opacity={0.43} color="#3b82f6" parallaxStrength={18} />
      <ScatteredParallaxIcon Icon={Stethoscope} size={53} top="30%" left="25%" opacity={0.4} color="#3b82f6" parallaxStrength={14} />
      <ScatteredParallaxIcon Icon={User} size={47} bottom="25%" left="30%" opacity={0.33} color="#3b82f6" parallaxStrength={16} />
      <ScatteredParallaxIcon Icon={HeartPulse} size={57} top="40%" right="15%" opacity={0.47} color="#3b82f6" parallaxStrength={11} />
      <ScatteredParallaxIcon Icon={Syringe} size={52} bottom="10%" right="25%" opacity={0.38} color="#3b82f6" parallaxStrength={19} />
      <ScatteredParallaxIcon Icon={Pill} size={63} top="15%" left="40%" opacity={0.4} color="#3b82f6" parallaxStrength={13} />

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
          isLoaded={isLoaded}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          handleCardClick={handleCardClick}
        />

        <AnimatedCard
          type="Doctor"
          icon={<Stethoscope size={36} color="#ffffff" />}
          title="Panel Médico"
          description="Administra citas, pacientes y consultas médicas y mucho más"
          gradient="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
          iconBg="linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
          isLoaded={isLoaded}
          hoveredCard={hoveredCard}
          setHoveredCard={setHoveredCard}
          handleCardClick={handleCardClick}
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
    </div>
  );
};

export default LandingPage;