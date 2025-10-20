

import React, { useState, useEffect } from "react";
import { User, Stethoscope, CalendarDays, Users, BarChart3 } from "lucide-react";
import type { Route } from '../types';

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
            transition: 'none',
            transform: 'translateX(0)',
            transitionDelay: '0s'
          }}>
            <span style={{
              position: 'absolute',
              left: 0,
              top: '50%',
              width: 5,
              height: 5,
              borderRadius: '50%',
              background: gradient,
              transition: 'none',
              transform: 'translateY(-50%) scale(1)'
            }} />
            {feature}
          </li>
        ))}
      </ul>
      
      <button 
        style={{
          ...buttonStyle,
          transform: 'scale(1)',
          boxShadow: '0 2px 8px rgba(59, 130, 246, 0.18)',
          transition: 'none'
        }}
        onClick={() => handleCardClick(type)}
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
        const AnimatedCard: React.FC<{ 
          type: 'Paciente' | 'Doctor', 
          icon: React.ReactNode, 
          title: string, 
          description: string, 
          features: string[],
          gradient: string,
          iconBg: string
        }> = ({ type, icon, title, description, features, gradient, iconBg }) => {
          return (
            <div 
              style={{
                ...cardStyle,
                opacity: isLoaded ? 1 : 0,
                transform: isLoaded ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                boxShadow: '0 4px 16px rgba(59, 130, 246, 0.08)',
                border: '1px solid rgba(59, 130, 246, 0.08)',
                transition: 'none'
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
                transition: 'none',
                transform: 'scale(1) rotate(0deg)',
                boxShadow: '0 2px 8px rgba(59, 130, 246, 0.12)'
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
                }}>
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
                        transition: 'none',
                        transform: 'translateX(0)',
                        transitionDelay: '0s'
                      }}>
                        <span style={{
                          position: 'absolute',
                          left: 0,
                          top: '50%',
                          width: 5,
                          height: 5,
                          borderRadius: '50%',
                          background: gradient,
                          transition: 'none',
                          transform: 'translateY(-50%) scale(1)'
                        }} />
                        {feature}
                      </li>
                    ))}
                  </ul>
              <button 
                style={{
                  ...buttonStyle,
                  transform: 'scale(1)',
                  boxShadow: '0 2px 8px rgba(59, 130, 246, 0.18)',
                  transition: 'none'
                }}
                onClick={() => handleCardClick(type)}
              >
                Acceder como {type}
              </button>
            </div>
          );
        };
          { icon: <CalendarDays size={24} color="#3b82f6" />, title: "Gestión de Citas", desc: "Sistema completo para agendar y administrar citas médicas" },
          { icon: <Users size={24} color="#22c55e" />, title: "Control de Pacientes", desc: "Registro y seguimiento del historial médico de pacientes" },
          { icon: <BarChart3 size={24} color="#3b82f6" />, title: "Reportes y Análisis", desc: "Estadísticas y reportes para mejorar la gestión clínica" }
        ].map((feature, index) => (
          <div key={index} style={{
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(10px)',
            borderRadius: 16,
            padding: 14,
            transition: 'none',
            transform: 'translateY(0)',
            boxShadow: '0 2px 8px rgba(59, 130, 246, 0.08)',
            border: '1px solid rgba(59, 130, 246, 0.08)'
          }}>
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