import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CalendarDays, Users, ClipboardList, BarChart2, ArrowLeft, UserIcon } from "lucide-react";

// Props aligned with other doctor pages for consistency
type DoctorPacientesProps = {
  id_usuario?: string;
  onBack?: () => void;
  onNavigate?: (page: "calendario" | "citas" | "pacientes" | "reportes") => void;
};

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

type Paciente = {
  id_paciente: string;
  nombre_completo: string;
  edad: number;
  telefono: string;
  correo: string;
  dui: string;
  ultima_consulta: string;
  total_citas: number;
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

export default function DoctorPacientes({ id_usuario, onBack, onNavigate }: DoctorPacientesProps) {
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [stats, setStats] = useState<DoctorStats>({
    total_citas: 0,
    citas_hoy: 0,
    citas_pendientes: 0,
    total_pacientes: 0,
  });
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    window.scrollTo(0, 0);
    if (!id_usuario) return;
    fetchDoctorData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id_usuario]);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      console.log('Fetching doctor data for id_usuario=', id_usuario);
      
      const doctorId = id_usuario || '';
      
      // Fetch doctor info and stats
      const res = await fetch(`http://localhost:3000/api/doctor/${encodeURIComponent(doctorId)}`);
      const data = await res.json();
      console.log('Doctor fetch response:', data);
      
      if (data.success) {
        setDoctor(data.doctor);
        setStats(data.stats);
      }

      // Fetch patients
      const resPacientes = await fetch(`http://localhost:3000/api/doctor/${encodeURIComponent(doctorId)}/pacientes`);
      const dataPacientes = await resPacientes.json();
      console.log('Patients fetch response:', dataPacientes);
      
      if (dataPacientes.success) {
        setPacientes(dataPacientes.pacientes);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    window.scrollTo(0, 0);
    if (onBack) onBack();
  };

  const formatFecha = (fecha: string) => {
    if (!fecha) return 'Sin consulta';
    const date = new Date(fecha);
    const options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
  };

  const pacientesFiltrados = pacientes.filter((p) =>
    p.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.id_paciente.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1200 }}>
        {/* Header */}
        <button style={ghostButtonStyle} onClick={handleBack}>
          <ArrowLeft size={18} />
          Regresar
        </button>

        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Panel de Doctor - Pacientes</h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>
          {doctor ? `Dr. ${doctor.nombre_completo}` : 'Cargando...'}
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
          style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
          onClick={() => onNavigate?.("citas")}
        >
          Citas
        </button>
        <button
          style={{ fontWeight: 600, color: "#222", borderBottom: "2px solid #222", paddingBottom: 4, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}
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

      {/* Base de pacientes */}
      <div style={cardStyle}>
        <h2 style={{ fontWeight: 600, fontSize: 18, marginTop: 0, textAlign: "left" }}>Base de Pacientes</h2>
        <p style={{ color: "#64748b", marginTop: 0, textAlign: "left" }}>Historial y gestión de pacientes</p>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, marginBottom: 16 }}>
          <input
            placeholder="Buscar paciente..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ flex: 1, maxWidth: 320, border: "1px solid #e5e7eb", borderRadius: 8, padding: "8px 12px" }}
          />
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {loading ? (
            <div style={{ color: "#64748b", fontSize: 16, textAlign: "center", padding: 24 }}>
              Cargando pacientes...
            </div>
          ) : pacientesFiltrados.length === 0 ? (
            <div style={{ color: "#64748b", fontSize: 16, textAlign: "center", padding: 24 }}>
              No se encontraron pacientes
            </div>
          ) : (
            pacientesFiltrados.map((p) => (
              <div
                key={p.id_paciente}
                style={{
                  ...cardStyle,
                  border: "1px solid #e5e7eb",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: 12
                }}
              >
                <div style={{ flex: 1, minWidth: 250 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                    <UserIcon size={16} style={{ color: "#64748b" }} />
                    <p style={{ fontWeight: 600, margin: 0 }}>{p.nombre_completo}</p>
                  </div>
                  <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0" }}>
                    {p.id_paciente} · {p.edad} años
                  </p>
                  <p style={{ fontSize: 14, color: "#64748b", margin: "4px 0" }}>
                    Última consulta: {formatFecha(p.ultima_consulta)} · Total citas: {p.total_citas}
                  </p>
                  {p.telefono && (
                    <p style={{ fontSize: 13, color: "#94a3b8", margin: "4px 0" }}>
                      Tel: {p.telefono}
                    </p>
                  )}
                </div>
                <Button variant="outline">Ver Historial</Button>
              </div>
            ))
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
