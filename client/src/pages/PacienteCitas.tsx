import { Calendar, Phone, User, Clock, Stethoscope, ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import LoadingSpinner from "../components/LoadingSpinner";

const cardStyle = {
  background: "#fff",
  borderRadius: 12,
  boxShadow: "0 2px 6px rgba(0,0,0,0.06)",
  padding: 16,
  minWidth: 240,
  flex: 1,
  textAlign: "left" as const,
  margin: '8px 0',
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
  nombre_completo?: string;
  onBack?: () => void;
  onNavigate?: (page: 'citas' | 'historial' | 'perfil' | 'agendar') => void;
};

export default function PacienteCitas({ id_usuario, nombre_completo, onBack, onNavigate }: PacienteCitasProps) {
  const [paciente, setPaciente] = useState<any>({ nombre_completo });
  const [citas, setCitas] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState<string | null>(null);

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

  const handleCancelarCita = async (id_cita: string) => {
    if (!confirm('¿Está seguro que desea cancelar esta cita?')) return;
    
    setCancelling(id_cita);
    try {
      const res = await fetch(`http://localhost:3000/api/cita/${id_cita}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: 'Cancelada' })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setCitas(citas.map(c => c.id_cita === id_cita ? {...c, estado: 'Cancelada'} : c));
        alert('Cita cancelada exitosamente');
      } else {
        alert('Error al cancelar la cita: ' + data.message);
      }
    } catch (err) {
      console.error('Error cancelling appointment', err);
      alert('Error del servidor al cancelar la cita');
    } finally {
      setCancelling(null);
    }
  };

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
        <div style={{ display: "flex", flexDirection: "column", gap: 16, minHeight: 200, justifyContent: loading ? "center" : "flex-start" }}>
          {loading ? (
            <LoadingSpinner size="medium" text="Cargando citas..." />
          ) : citas.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: 16 }}>No hay citas agendadas</div>
          ) : (
            citas.map((cita) => (
              <div key={cita.id_cita} style={{ 
                ...cardStyle, 
                borderLeft: `4px solid ${
                  cita.estado === 'Pendiente' ? "#f59e0b" : 
                  cita.estado === 'Confirmada' ? "#10b981" : 
                  cita.estado === 'Cancelada' ? "#94a3b8" : "#3b82f6"
                }`,
                position: 'relative',
                paddingRight: '16px'
              }}>
                <div style={{ 
                  position: 'absolute', 
                  top: 16, 
                  right: 16,
                  padding: '2px 8px',
                  borderRadius: 12,
                  fontSize: 12,
                  fontWeight: 500,
                  color: cita.estado === 'Pendiente' ? "#b45309" : cita.estado === 'Confirmada' ? "#047857" : cita.estado === 'Cancelada' ? "#64748b" : "#1d4ed8",
                  backgroundColor: cita.estado === 'Pendiente' ? "#fef3c7" : cita.estado === 'Confirmada' ? "#d1fae5" : cita.estado === 'Cancelada' ? "#f1f5f9" : "#dbeafe"
                }}>
                  {cita.estado}
                </div>
                
                <div style={{ marginBottom: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <Calendar size={16} color="#4b5563" />
                    <div>
                      <p style={{ fontSize: 14, color: "#4b5563", margin: 0 }}>{formatFecha(cita.fecha)}</p>
                      <p style={{ fontSize: 14, color: "#6b7280", margin: '2px 0 0 0' }}>{cita.hora?.slice(0,5)}</p>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 8, margin: '12px 0' }}>
                    <User size={16} color="#4b5563" />
                    <p style={{ fontSize: 14, color: "#1f2937", margin: 0, fontWeight: 500 }}>{cita.doctor_nombre}</p>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <Stethoscope size={16} color="#4b5563" />
                    <p style={{ fontSize: 14, color: "#4b5563", margin: 0 }}>{cita.especialidad}</p>
                  </div>
                </div>
                
                {(cita.estado === 'Pendiente' || cita.estado === 'Confirmada') && (
                  <button
                    onClick={() => handleCancelarCita(cita.id_cita)}
                    disabled={cancelling === cita.id_cita}
                    style={{
                      position: 'absolute',
                      bottom: 16,
                      right: 16,
                      padding: "4px 8px",
                      width: 'auto',
                      maxWidth: 'none',
                      height: '28px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 12,
                      lineHeight: '1',
                      borderRadius: 6,
                      border: "1px solid #dc2626",
                      background: cancelling === cita.id_cita ? "#f5f5f5" : "#fff",
                      color: "#dc2626",
                      cursor: cancelling === cita.id_cita ? "not-allowed" : "pointer",
                      opacity: cancelling === cita.id_cita ? 0.7 : 1,
                      whiteSpace: "nowrap",
                      transition: 'all 0.2s',
                      boxSizing: 'border-box',
                      ...(cancelling !== cita.id_cita && {
                        ':hover': {
                          background: '#fef2f2',
                          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }
                      })
                    }}
                  >
                    {cancelling === cita.id_cita ? 'Cancelando...' : 'Cancelar'}
                  </button>
                )}
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