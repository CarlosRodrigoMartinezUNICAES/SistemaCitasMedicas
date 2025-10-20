import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, ClipboardList, BarChart2, ArrowLeft, Clock, User as UserIcon, Stethoscope } from "lucide-react";

// Props aligned with DoctorCalendario for consistency
type DoctorCitasProps = {
  id_usuario?: string;
  onBack?: () => void;
  onNavigate?: (page: "calendario" | "citas" | "pacientes" | "reportes") => void;
};

// Types matching DoctorCalendario
type DoctorStats = {
  total_citas: number;
  citas_hoy: number;
  citas_pendientes: number;
  total_pacientes: number;
};

type DoctorInfo = {
  id_doctor: string;
  nombre_completo: string;
  especialidad: string;
};

type Appointment = {
  id_cita: string;
  fecha: string;
  hora: string;
  estado: string;
  paciente_nombre: string;
  paciente_telefono: string;
};

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

const ghostButtonStyle: React.CSSProperties = {
  background: "#fff",
  color: "#222",
  border: "none",
  display: "flex",
  alignItems: "center",
  gap: 8,
  marginBottom: 16,
  cursor: "pointer",
  fontWeight: 500,
  fontSize: 15,
};

const navBarStyle: React.CSSProperties = {
  display: "flex",
  gap: 24,
  borderBottom: "1px solid #e5e7eb",
  paddingBottom: 12,
  marginBottom: 24,
};

export default function DoctorCitas({ id_usuario, onBack, onNavigate }: DoctorCitasProps) {
  const [filtro, setFiltro] = useState("");
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [stats, setStats] = useState<DoctorStats>({
    total_citas: 0,
    citas_hoy: 0,
    citas_pendientes: 0,
    total_pacientes: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState<string | null>(null);

  useEffect(() => {
    if (!id_usuario) return;
    fetchDoctorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_usuario]);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      console.log('Fetching doctor data for id_usuario=', id_usuario);
      
      const doctorId = id_usuario || '';
      const res = await fetch(`http://localhost:3000/api/doctor/${encodeURIComponent(doctorId)}`);
      const data = await res.json();
      console.log('Doctor fetch response:', data);
      
      if (data.success) {
        setDoctor(data.doctor);
        setStats(data.stats);
        // Process appointments
        const processedAppointments = (data.appointments || []).map((appt: any) => {
          const rawFecha = appt.fecha;
          let fechaStr: string;
          if (typeof rawFecha === 'string') {
            fechaStr = rawFecha.includes('T') ? rawFecha.split('T')[0] : rawFecha;
          } else {
            fechaStr = new Date(rawFecha).toISOString().split('T')[0];
          }
          return {
            ...appt,
            id_cita: String(appt.id_cita),
            fecha: fechaStr
          } as Appointment;
        });
        setAppointments(processedAppointments);
        console.log('Processed appointments:', processedAppointments.length);
      } else {
        console.warn('Doctor not found or error', data);
      }
    } catch (err) {
      console.error('Error fetching doctor data', err);
    } finally {
      setLoading(false);
    }
  };

  const citasFiltradas = useMemo(
    () => appointments.filter((c) => c.paciente_nombre.toLowerCase().includes(filtro.toLowerCase())),
    [appointments, filtro]
  );

  const handleCambiarEstado = async (id_cita: string, nuevoEstado: string) => {
    setUpdatingStatus(id_cita);
    try {
      const res = await fetch(`http://localhost:3000/api/cita/${id_cita}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
      });
      const data = await res.json();
      if (data.success) {
        // Update local state
        setAppointments(appointments.map(c => 
          c.id_cita === id_cita ? {...c, estado: nuevoEstado} : c
        ));
        // Update stats if needed
        if (nuevoEstado === 'Pendiente' || appointments.find(c => c.id_cita === id_cita)?.estado === 'Pendiente') {
          fetchDoctorData();
        }
      } else {
        alert('Error al actualizar estado: ' + data.message);
      }
    } catch (err) {
      console.error('Error updating status', err);
      alert('Error del servidor al actualizar el estado');
    } finally {
      setUpdatingStatus(null);
    }
  };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1200 }}>
        <button style={ghostButtonStyle} onClick={() => onBack && onBack()}>
          <ArrowLeft size={18} /> Regresar
        </button>

        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Panel de Doctor</h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>
          {doctor ? `Bienvenido, Dr. ${doctor.nombre_completo}` : 'Bienvenido'}
        </p>

        {/* Estadísticas */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <CalendarDays size={20} style={{ color: "#3b82f6" }} />
              <div>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Total de Citas</p>
                <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{stats.total_citas}</p>
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <Users size={20} style={{ color: "#10b981" }} />
              <div>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Citas Hoy</p>
                <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{stats.citas_hoy}</p>
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <ClipboardList size={20} style={{ color: "#f59e0b" }} />
              <div>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Pendientes</p>
                <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{stats.citas_pendientes}</p>
              </div>
            </div>
          </div>
          <div style={cardStyle}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginBottom: 8 }}>
              <BarChart2 size={20} style={{ color: "#8b5cf6" }} />
              <div>
                <p style={{ fontSize: 14, color: "#64748b", margin: 0 }}>Pacientes</p>
                <p style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>{stats.total_pacientes}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navegación Doctor */}
        <div style={navBarStyle}>
          <button
            style={{ fontWeight: 600, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.("calendario")}
          >
            Calendario
          </button>
          <button
            style={{ fontWeight: 600, color: "#222", borderBottom: "2px solid #222", paddingBottom: 4, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}
          >
            Citas
          </button>
          <button
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.("pacientes")}
          >
            Pacientes
          </button>
          <button
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.("reportes")}
          >
            Reportes
          </button>
        </div>

        {/* Gestión de citas */}
        <div style={cardStyle}>
          <h2 style={{ fontWeight: 600, fontSize: 18, marginTop: 0 }}>Gestión de Citas</h2>
          <p style={{ color: "#64748b", marginTop: 0 }}>Administra y filtra las citas médicas</p>

          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
            <input
              placeholder="Buscar paciente..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              style={{ flex: 1, maxWidth: 320, border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px" }}
            />
            <Button variant="outline">Todos los estados</Button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {loading ? (
              <div style={{ color: "#64748b", fontSize: 16, textAlign: "center", padding: 24 }}>
                Cargando citas...
              </div>
            ) : citasFiltradas.length === 0 ? (
              <div style={{ color: "#64748b", fontSize: 16, textAlign: "center", padding: 24 }}>
                No se encontraron citas
              </div>
            ) : (
              citasFiltradas.map((cita) => (
              <div key={cita.id_cita} style={{ ...cardStyle, border: "2px dotted #60a5fa", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                <div style={{ flex: 1, minWidth: 250 }}>
                  <p style={{
                    fontSize: 12,
                    color: cita.estado === 'Pendiente' ? "#dc2626" : cita.estado === 'Confirmada' ? "#16a34a" : cita.estado === 'Cancelada' ? "#94a3b8" : "#2563eb",
                    fontWeight: 600,
                    marginBottom: 8,
                    marginTop: 0
                  }}>
                    {cita.estado}
                  </p>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", marginBottom: 4 }}>
                    <Clock size={16} />
                    <p style={{ margin: 0 }}>{cita.hora}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", marginBottom: 4 }}>
                    <UserIcon size={16} />
                    <p style={{ margin: 0 }}>{cita.paciente_nombre}</p>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", marginBottom: 4 }}>
                    <Stethoscope size={16} />
                    <p style={{ margin: 0 }}>{doctor?.especialidad || 'N/A'}</p>
                  </div>
                  <p style={{ color: "#64748b", margin: 0, fontSize: 12 }}>{cita.fecha} · Tel: {cita.paciente_telefono}</p>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, minWidth: 140 }}>
                  <select
                    value={cita.estado}
                    onChange={(e) => handleCambiarEstado(cita.id_cita, e.target.value)}
                    disabled={updatingStatus === cita.id_cita}
                    style={{
                      padding: "6px 10px",
                      borderRadius: 6,
                      border: "1px solid #e5e7eb",
                      background: "#fff",
                      fontSize: 13,
                      cursor: updatingStatus === cita.id_cita ? "not-allowed" : "pointer"
                    }}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Confirmada">Confirmada</option>
                    <option value="Atendida">Atendida</option>
                    <option value="Cancelada">Cancelada</option>
                  </select>
                  {updatingStatus === cita.id_cita && (
                    <p style={{ fontSize: 11, color: "#64748b", margin: 0, textAlign: "center" }}>Actualizando...</p>
                  )}
                </div>
              </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
