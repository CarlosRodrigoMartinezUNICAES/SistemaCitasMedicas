import { Calendar, Phone, User, Clock, Stethoscope, ArrowLeft } from "lucide-react";
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

type PacienteCitasProps = {
  id_usuario?: string;
  onBack?: () => void;
  onNavigate?: (page: 'citas' | 'historial' | 'perfil' | 'agendar') => void;
};

export default function PacienteCitas({ id_usuario, onBack, onNavigate }: PacienteCitasProps) {
  const [paciente, setPaciente] = useState<any>(null);
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!id_usuario) return;
    const fetchPaciente = async () => {
      setLoading(true);
      try {
        console.log('Fetching paciente for id_usuario=', id_usuario);
        const res = await fetch(`http://localhost:3000/api/paciente/${encodeURIComponent(id_usuario)}`);
        const data = await res.json();
        console.log('Paciente fetch response:', data);
        if (data.success) {
          setPaciente(data.paciente);
          setCitas(data.citas || []);
        } else {
          setPaciente(null);
          setCitas([]);
          console.warn('Paciente not found or error', data);
        }
      } catch (err) {
        setPaciente(null);
        setCitas([]);
        console.error('Error fetching paciente', err);
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
            style={{ fontWeight: 600, color: "#222", borderBottom: "2px solid #222", paddingBottom: 4, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}
          >
            Mis Citas
          </button>
          <button 
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.('historial')}
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
          <button onClick={() => onNavigate?.('agendar')} style={{ ...buttonStyle, height: 48, padding: "0 32px", borderRadius: 10, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}>
            + Nueva Cita
          </button>
        </div>
        {/* Citas reales */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {loading ? (
            <div style={{ color: "#64748b", fontSize: 16 }}>Cargando citas...</div>
          ) : citas.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: 16 }}>No hay citas agendadas</div>
          ) : (
            citas.map((cita) => (
              <div key={cita.id_cita} style={{ ...cardStyle, border: "2px dotted #60a5fa", textAlign: "left" }}>
                <p style={{ fontSize: 12, color: cita.estado === 'Pendiente' ? "#dc2626" : cita.estado === 'Confirmada' ? "#16a34a" : "#2563eb", fontWeight: 600, marginBottom: 4 }}>{cita.estado}</p>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155" }}>
                  <Calendar size={16} />
                  <p>{formatFecha(cita.fecha)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", marginTop: 4 }}>
                  <Clock size={16} />
                  <p>{cita.hora?.slice(0,5)}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", marginTop: 4 }}>
                  <User size={16} />
                  <p>{cita.doctor_nombre}</p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", marginTop: 4 }}>
                  <Stethoscope size={16} />
                  <p>{cita.especialidad}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

function formatFecha(fecha: string) {
  // yyyy-mm-dd to 'Día, dd de Mes de yyyy'
  const dias = ['Domingo','Lunes','Martes','Miércoles','Jueves','Viernes','Sábado'];
  const meses = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const d = new Date(fecha);
  return `${dias[d.getDay()]}, ${d.getDate().toString().padStart(2,'0')} de ${meses[d.getMonth()]} de ${d.getFullYear()}`;
}