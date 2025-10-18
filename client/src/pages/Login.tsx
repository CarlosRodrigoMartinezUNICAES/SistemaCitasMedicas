
import React, { useState } from 'react';
import axios from 'axios';
import { User, Stethoscope } from "lucide-react";

interface LoginProps {
  tipo_usuario: 'Paciente' | 'Doctor';
  onBack: () => void;
  onSuccess?: (userId: string, tipo: string) => void;
}

const cardStyle = {
  width: 340,
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  margin: 8,
  padding: 32,
  display: "flex",
  flexDirection: "column" as const,
  alignItems: "center" as const,
  textAlign: "center" as const
};
const buttonStyle = {
  background: "#222",
  color: "#fff",
  borderRadius: 6,
  padding: "10px 24px",
  border: "none",
  marginTop: 12,
  cursor: "pointer"
};
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 6,
  border: "1px solid #e5e7eb",
  marginBottom: 16,
  fontSize: 16
};

const Login: React.FC<LoginProps> = ({ tipo_usuario, onBack, onSuccess }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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
        console.log('Parsed userId:', userId, 'userTipo:', userTipo);
        if (userId && userTipo) {
          console.log('Calling onSuccess callback with', userId, userTipo);
          onSuccess && onSuccess(userId, userTipo);
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
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={cardStyle}>
        <div style={{ background: tipo_usuario === 'Paciente' ? "#dbeafe" : "#bbf7d0", padding: 16, borderRadius: "50%", marginBottom: 16 }}>
          {tipo_usuario === 'Paciente' ? <User size={32} color="#3b82f6" /> : <Stethoscope size={32} color="#22c55e" />}
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>Acceso {tipo_usuario}</h2>
        <form onSubmit={handleSubmit} style={{ width: "100%", maxWidth: 260, margin: "0 auto", textAlign: "left" }}>
          <label htmlFor="username" style={{ fontWeight: 500, color: "#475569", fontSize: 14 }}>Usuario</label>
          <input
            id="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            style={inputStyle}
          />
          <label htmlFor="password" style={{ fontWeight: 500, color: "#475569", fontSize: 14 }}>Contraseña</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          {error && <div style={{ color: "#dc2626", fontSize: 14, marginBottom: 8 }}>{error}</div>}
          <button type="submit" disabled={loading} style={buttonStyle}>
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
          <button type="button" onClick={onBack} style={{ ...buttonStyle, background: "#fff", color: "#222", border: "1px solid #222", marginLeft: 8 }}>
            Volver
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;