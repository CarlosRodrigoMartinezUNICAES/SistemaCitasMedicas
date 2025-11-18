import React, { useState } from 'react';
import axios from 'axios';
import { ArrowLeft } from "lucide-react"; // Only keep ArrowLeft
import './Login.css';

interface LoginProps {
  tipo_usuario: 'Paciente' | 'Doctor';
  onBack: () => void;
  onSuccess?: (userId: string, tipo: string, nombre_completo?: string) => void;
}

const cardStyle = {
  width: 400,
  background: "linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)",
  borderRadius: 20,
  boxShadow: "0 8px 32px rgba(59, 130, 246, 0.1)",
  margin: 8,
  padding: 40,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center" as const,
  textAlign: "center" as const,
  border: "1px solid rgba(59, 130, 246, 0.1)",
  backdropFilter: "blur(10px)",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
  position: "relative" as const,
  overflow: "hidden" as const
};

const buttonStyle = {
  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
  color: "#fff",
  borderRadius: 12,
  padding: "14px 28px",
  border: "none",
  marginTop: 16,
  cursor: "pointer",
  fontWeight: 600,
  fontSize: 16,
  transition: "all 0.3s ease",
  boxShadow: "0 4px 15px rgba(59, 130, 246, 0.3)",
  position: "relative" as const,
  overflow: "hidden" as const
};

const inputStyle = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 12,
  border: "1px solid rgba(59, 130, 246, 0.2)",
  marginBottom: 20,
  fontSize: 16,
  background: "rgba(255, 255, 255, 0.8)",
  transition: "all 0.3s ease",
  boxShadow: "0 2px 8px rgba(59, 130, 246, 0.05)"
};

const Login: React.FC<LoginProps> = ({ tipo_usuario, onBack, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Removed isLoaded state and useEffect related to it as it was unused and causing errors.

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:3000/api/login', {
        username,
        password,
        tipo_usuario
      });

      console.log('Login response:', response.data);

      if (response.data.success) {
        // Handle successful login
        console.log('Login successful');
        const returnedUser = response.data.user || {};
        const userId = returnedUser.id_usuario || returnedUser.id || returnedUser.idUser || null;
        const userTipo = returnedUser.tipo || returnedUser.tipo_usuario || null;
        const nombre_completo = returnedUser.nombre_completo || null; // Extract nombre_completo
        console.log('Parsed userId:', userId, 'userTipo:', userTipo, 'nombre_completo:', nombre_completo);
        if (userId && userTipo) {
          console.log('Calling onSuccess callback with', userId, userTipo, nombre_completo);
          onSuccess && onSuccess(userId, userTipo, nombre_completo);
        } else {
          console.warn('Login returned success but user id/tipo missing', returnedUser);
        }
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    } catch (error) {
      setError("Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 50%, #f0fdf4 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
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

      <div style={{ ...cardStyle }}>
        <h2 style={{
          fontWeight: 700,
          fontSize: 24,
          marginBottom: 24,
          background: tipo_usuario === 'Paciente'
            ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
            : 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text'
        }}>
          Acceso {tipo_usuario}
        </h2>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 320, margin: "0 auto", textAlign: "left", display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <label htmlFor="username" style={{ fontWeight: 600, color: "#374151", fontSize: 14, marginBottom: 8, display: 'block' }}>Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />

          <label htmlFor="password" style={{ fontWeight: 600, color: "#374151", fontSize: 14, marginBottom: 8, display: 'block' }}>Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />

          {error && (
            <div style={{
              color: "#dc2626",
              fontSize: 14,
              marginBottom: 16,
              background: 'rgba(220, 38, 38, 0.1)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid rgba(220, 38, 38, 0.2)'
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'flex', gap: 12, marginTop: 8, width: '100%', maxWidth: 320 }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                ...buttonStyle,
                flex: 1,
                minWidth: 120,
                opacity: loading ? 0.7 : 1
              }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
            <button
              type="button"
              onClick={onBack}
              style={{
                ...buttonStyle,
                background: "rgba(255, 255, 255, 0.8)",
                color: "#374151",
                border: "1px solid #3b82f6",
                boxShadow: "0 2px 8px rgba(59, 130, 246, 0.1)",
                flex: 1,
                minWidth: 120,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8
              }}
            >
              <ArrowLeft size={16} />
              Volver
            </button>
          </div>
        </form>
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

export default Login;