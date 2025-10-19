import { Phone, Calendar, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

// Minimal input component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', ...props.style }} />
);

type PacientePerfilProps = {
  id_usuario?: string;
  onBack?: () => void;
  onNavigate?: (page: 'citas' | 'historial' | 'perfil') => void;
};

export default function PacientePerfil({ id_usuario, onBack, onNavigate }: PacientePerfilProps) {
  const [paciente, setPaciente] = useState<any>(null);

  useEffect(() => {
    if (!id_usuario) return;
    const fetchPaciente = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/paciente/${encodeURIComponent(id_usuario)}`);
        const data = await res.json();
        if (data.success) setPaciente(data.paciente);
      } catch (err) {
        console.error('Error fetching paciente', err);
      }
    };
    fetchPaciente();
  }, [id_usuario]);

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 900 }}>
        <button style={{
          background: "#fff",
          color: "#222",
          border: "none",
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 16,
          cursor: "pointer",
          fontWeight: 500,
          fontSize: 15
        }} onClick={() => onBack && onBack()}>
          <ArrowLeft size={18} /> Regresar
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Panel de Paciente</h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>{paciente ? `Bienvenido, ${paciente.nombre_completo}` : 'Bienvenido'}</p>
        
        {/* Navegación */}
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #e5e7eb", paddingBottom: 12, marginBottom: 24 }}>
          <button 
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.('citas')}
          >
            Mis Citas
          </button>
          <button 
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.('historial')}
          >
            Historial Médico
          </button>
          <button 
            style={{ fontWeight: 600, color: "#222", borderBottom: "2px solid #222", paddingBottom: 4, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}
          >
            Mi Perfil
          </button>
        </div>

        {/* Información del paciente */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 32 }}>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 20, minWidth: 200, flex: 1, textAlign: "center", margin: 4 }}>
            <p style={{ color: "#64748b" }}>Paciente ID</p>
            <p style={{ fontWeight: 600, fontSize: 18 }}>{paciente?.id_paciente || '—'}</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 20, minWidth: 200, flex: 1, textAlign: "center", margin: 4 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: "#334155" }}>
              <Phone size={16} />
              <p>{paciente?.telefono || '—'}</p>
            </div>
            <p style={{ color: "#64748b", marginTop: 4 }}>Teléfono</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 20, minWidth: 200, flex: 1, textAlign: "center", margin: 4 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: "#a21caf" }}>
              <Calendar size={16} />
              <p>{paciente?.edad ? `${paciente.edad} años` : '—'}</p>
            </div>
            <p style={{ color: "#64748b", marginTop: 4 }}>Edad</p>
          </div>
          <button style={{ 
            background: "#222",
            color: "#fff", 
            border: "none",
            margin: 4,
            fontWeight: 500,
            cursor: "pointer",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
            height: 48,
            padding: "0 32px",
            borderRadius: 10
          }}>
            + Nueva Cita
          </button>
        </div>

        {/* Form section */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 24 }}>
          <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Información personal</h3>
          <p style={{ color: "#64748b", marginBottom: 20, fontSize: 14 }}>Actualiza tus datos de contacto</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Nombre Completo</p>
              <Input placeholder={paciente?.nombre_completo || ''} style={{ background: "#fff" }} />
            </div>

            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>DUI</p>
              <Input placeholder={paciente?.dui || ''} style={{ background: "#fff" }} />
            </div>

            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Teléfono</p>
              <Input placeholder={paciente?.telefono || ''} style={{ background: "#fff" }} />
            </div>

            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Correo Electrónico</p>
              <Input placeholder={paciente?.correo || ''} style={{ background: "#fff" }} />
            </div>
          </div>

          <button style={{ background: "#222", color: "#fff", borderRadius: 8, padding: "12px 24px", border: "none", marginTop: 8, fontWeight: 500, cursor: "pointer", boxShadow: "0 1px 4px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: 8 }}>
            + Actualizar información
          </button>
        </div>
      </div>
    </div>
  );
}
