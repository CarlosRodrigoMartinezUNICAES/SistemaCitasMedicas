import { Calendar, Phone, User, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";

const cardStyle = {
  background: "#fff",
  borderRadius: 16,
  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
  padding: 20,
  minWidth: 200,
  flex: 1,
  textAlign: "center" as const,
  margin: 4,
};
const buttonStyle = {
  background: "#222",
  color: "#fff",
  borderRadius: 8,
  padding: "12px 24px",
  border: "none",
  margin: 4,
  fontWeight: 500,
  cursor: "pointer",
  boxShadow: "0 1px 4px rgba(0,0,0,0.06)"
};
const ghostButtonStyle = {
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
};

type PacienteHistorialProps = {
  id_usuario?: string;
  nombre_completo?: string;
  onBack?: () => void;
  onNavigate?: (page: 'citas' | 'historial' | 'perfil' | 'agendar') => void;
};

export default function PacienteHistorialMedico({ id_usuario, nombre_completo, onBack, onNavigate }: PacienteHistorialProps) {
  const [paciente, setPaciente] = useState<any>({ nombre_completo });
  const [consultas, setConsultas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id_usuario) return;
    const fetchPaciente = async () => {
      setLoading(true);
      try {
        const res = await fetch(`http://localhost:3000/api/paciente/${encodeURIComponent(id_usuario)}`);
        const data = await res.json();
        if (data.success) {
          setPaciente(data.paciente);
          setConsultas(data.consultas || []);
        } else {
          setPaciente(null);
          setConsultas([]);
        }
      } catch (err) {
        console.error('Error fetching paciente/consultas', err);
      } finally {
        setLoading(false);
      }
    };
    fetchPaciente();
  }, [id_usuario]);

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 900 }}>
        <button style={ghostButtonStyle} onClick={() => onBack && onBack()}>
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
            style={{ fontWeight: 600, color: "#222", borderBottom: "2px solid #222", paddingBottom: 4, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}
          >
            Historial Médico
          </button>
          <button style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }} onClick={() => onNavigate?.('perfil')}>Mi Perfil</button>
        </div>

        {/* Información del paciente */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 32 }}>
          <div style={cardStyle}>
            <p style={{ color: "#64748b" }}>Paciente ID</p>
            <p style={{ fontWeight: 600, fontSize: 18 }}>{paciente?.id_paciente || '—'}</p>
          </div>
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: "#334155" }}>
              <Phone size={16} />
              <p>{paciente?.telefono || '—'}</p>
            </div>
            <p style={{ color: "#64748b", marginTop: 4 }}>Teléfono</p>
          </div>
          <div style={cardStyle}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: "#a21caf" }}>
              <Calendar size={16} />
              <p>{paciente?.edad ? `${paciente.edad} años` : '—'}</p>
            </div>
            <p style={{ color: "#64748b", marginTop: 4 }}>Edad</p>
          </div>
          <button 
            onClick={() => onNavigate?.('agendar')}
            style={{ ...buttonStyle, height: 48, padding: "0 32px", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
          >
            + Nueva Cita
          </button>
        </div>

        {/* Historial Médico */}
        <div style={{ ...cardStyle, padding: 20, textAlign: "left" }}>
          <p style={{ color: "#1e293b", fontWeight: 500, marginBottom: 4 }}>Historial Médico</p>
          <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Consultas y reportes médicos anteriores</p>

          {loading ? (
            <div style={{ color: "#64748b", fontSize: 16 }}>Cargando consultas...</div>
          ) : consultas.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: 16 }}>No hay consultas registradas</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {consultas.map((consulta) => (
                <div key={consulta.id_consulta} style={{ ...cardStyle, border: "1px solid #e5e7eb", textAlign: "left" }}>
                  <p style={{ color: "#1e293b", fontWeight: 500, marginBottom: 4 }}>{consulta.especialidad}</p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#64748b", marginBottom: 8 }}>
                    <User size={16} />
                    <p>{consulta.doctor_nombre}</p>
                  </div>
                  <p style={{ color: "#475569", fontSize: 14 }}>{consulta.reporte_paciente || 'Sin reporte'}</p>
                  <p style={{ color: "#64748b", fontSize: 14, marginTop: 8 }}>
                    {formatFecha(consulta.fecha_consulta)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatFecha(fecha: string) {
  const d = new Date(fecha);
  return d.toLocaleDateString('es-ES', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}