import { useEffect, useState } from "react";
import { CalendarDays, Users, ClipboardList, BarChart2, ArrowLeft, TrendingUp, PieChart } from "lucide-react";

type DoctorReportesProps = {
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

type CitaPorEstado = {
  estado: string;
  total: number;
};

type CitaPorMes = {
  mes: string;
  total: number;
};

type EdadPaciente = {
  rango_edad: string;
  total: number;
};

type PacienteFrecuente = {
  nombre_completo: string;
  total_citas: number;
};

type ReportData = {
  citas_por_estado: CitaPorEstado[];
  citas_por_mes: CitaPorMes[];
  edades_pacientes: EdadPaciente[];
  pacientes_frecuentes: PacienteFrecuente[];
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

export default function DoctorReportes({ id_usuario, onBack, onNavigate }: DoctorReportesProps) {
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [stats, setStats] = useState<DoctorStats>({
    total_citas: 0,
    citas_hoy: 0,
    citas_pendientes: 0,
    total_pacientes: 0,
  });
  const [reportData, setReportData] = useState<ReportData>({
    citas_por_estado: [],
    citas_por_mes: [],
    edades_pacientes: [],
    pacientes_frecuentes: [],
  });
  const [loading, setLoading] = useState(false);

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
      
      if (data.success) {
        setDoctor(data.doctor);
        setStats(data.stats);
      }

      // Fetch report data
      const resReportes = await fetch(`http://localhost:3000/api/doctor/${encodeURIComponent(doctorId)}/reportes`);
      const dataReportes = await resReportes.json();
      
      if (dataReportes.success) {
        setReportData(dataReportes.reportes);
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

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'Confirmada': return '#10b981';
      case 'Pendiente': return '#f59e0b';
      case 'Cancelada': return '#ef4444';
      case 'Completada': return '#3b82f6';
      default: return '#64748b';
    }
  };

  const getEdadColor = (index: number) => {
    const colors = ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981'];
    return colors[index % colors.length];
  };

  const formatMes = (mes: string) => {
    const [year, month] = mes.split('-');
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    return `${months[parseInt(month) - 1]} ${year}`;
  };

  // Calculate totals for percentages
  const totalCitasEstado = reportData.citas_por_estado.reduce((sum, item) => sum + item.total, 0);
  const totalPacientesEdad = reportData.edades_pacientes.reduce((sum, item) => sum + item.total, 0);
  const maxCitasMes = Math.max(...reportData.citas_por_mes.map(item => item.total), 1);

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 1200 }}>
        {/* Header */}
        <button style={ghostButtonStyle} onClick={handleBack}>
          <ArrowLeft size={18} />
          Regresar
        </button>

        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Panel de Doctor - Reportes</h1>
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
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.("pacientes")}
          >
            Pacientes
          </button>
          <button
            style={{ fontWeight: 600, color: "#222", borderBottom: "2px solid #222", paddingBottom: 4, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}
          >
            Reportes
          </button>
        </div>

        {loading ? (
          <div style={{ color: "#64748b", fontSize: 16, textAlign: "center", padding: 48 }}>
            Cargando reportes...
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Row 1: Citas por Estado & Tendencia Mensual */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {/* Citas por Estado (Pie Chart) */}
              <div style={{ ...cardStyle, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <PieChart size={20} style={{ color: "#3b82f6" }} />
                  <h2 style={{ fontWeight: 600, fontSize: 18, margin: 0 }}>Citas por Estado</h2>
                </div>
                
                {reportData.citas_por_estado.length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center", padding: 24 }}>No hay datos disponibles</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {reportData.citas_por_estado.map((item) => {
                      const percentage = totalCitasEstado > 0 ? (item.total / totalCitasEstado) * 100 : 0;
                      return (
                        <div key={item.estado}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.estado}</span>
                            <span style={{ fontSize: 14, color: "#64748b" }}>{item.total} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div style={{ background: "#f1f5f9", borderRadius: 8, height: 8, overflow: "hidden" }}>
                            <div
                              style={{
                                background: getEstadoColor(item.estado),
                                height: "100%",
                                width: `${percentage}%`,
                                transition: "width 0.3s ease"
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Tendencia Mensual (Bar Chart) */}
              <div style={{ ...cardStyle, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <TrendingUp size={20} style={{ color: "#10b981" }} />
                  <h2 style={{ fontWeight: 600, fontSize: 18, margin: 0 }}>Tendencia Últimos 6 Meses</h2>
                </div>
                
                {reportData.citas_por_mes.length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center", padding: 24 }}>No hay datos disponibles</p>
                ) : (
                  <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-around", height: 200, gap: 8 }}>
                    {reportData.citas_por_mes.map((item) => {
                      const heightPercentage = (item.total / maxCitasMes) * 100;
                      return (
                        <div key={item.mes} style={{ display: "flex", flexDirection: "column", alignItems: "center", flex: 1 }}>
                          <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#3b82f6" }}>
                            {item.total}
                          </div>
                          <div
                            style={{
                              background: "linear-gradient(180deg, #3b82f6 0%, #60a5fa 100%)",
                              width: "100%",
                              maxWidth: 60,
                              borderRadius: "8px 8px 0 0",
                              height: `${Math.max(heightPercentage, 5)}%`,
                              minHeight: 20,
                              transition: "height 0.3s ease"
                            }}
                          />
                          <div style={{ fontSize: 11, color: "#64748b", marginTop: 8, textAlign: "center", transform: "rotate(-45deg)", transformOrigin: "center", whiteSpace: "nowrap" }}>
                            {formatMes(item.mes)}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Row 2: Distribución por Edad & Pacientes Frecuentes */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 24 }}>
              {/* Distribución por Edad */}
              <div style={{ ...cardStyle, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Users size={20} style={{ color: "#8b5cf6" }} />
                  <h2 style={{ fontWeight: 600, fontSize: 18, margin: 0 }}>Distribución por Edad</h2>
                </div>
                
                {reportData.edades_pacientes.length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center", padding: 24 }}>No hay datos disponibles</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {reportData.edades_pacientes.map((item, index) => {
                      const percentage = totalPacientesEdad > 0 ? (item.total / totalPacientesEdad) * 100 : 0;
                      return (
                        <div key={item.rango_edad}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                            <span style={{ fontSize: 14, fontWeight: 500 }}>{item.rango_edad}</span>
                            <span style={{ fontSize: 14, color: "#64748b" }}>{item.total} ({percentage.toFixed(1)}%)</span>
                          </div>
                          <div style={{ background: "#f1f5f9", borderRadius: 8, height: 8, overflow: "hidden" }}>
                            <div
                              style={{
                                background: getEdadColor(index),
                                height: "100%",
                                width: `${percentage}%`,
                                transition: "width 0.3s ease"
                              }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Pacientes Más Frecuentes */}
              <div style={{ ...cardStyle, textAlign: "left" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                  <Users size={20} style={{ color: "#ec4899" }} />
                  <h2 style={{ fontWeight: 600, fontSize: 18, margin: 0 }}>Top 5 Pacientes Frecuentes</h2>
                </div>
                
                {reportData.pacientes_frecuentes.length === 0 ? (
                  <p style={{ color: "#64748b", textAlign: "center", padding: 24 }}>No hay datos disponibles</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {reportData.pacientes_frecuentes.map((item, index) => (
                      <div
                        key={index}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          padding: "12px 16px",
                          background: "#f8fafc",
                          borderRadius: 8,
                          border: "1px solid #e5e7eb"
                        }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div
                            style={{
                              background: "#ec4899",
                              color: "#fff",
                              width: 28,
                              height: 28,
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 14,
                              fontWeight: 600
                            }}
                          >
                            {index + 1}
                          </div>
                          <span style={{ fontSize: 14, fontWeight: 500 }}>{item.nombre_completo}</span>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          <span style={{ fontSize: 16, fontWeight: 600, color: "#ec4899" }}>{item.total_citas}</span>
                          <span style={{ fontSize: 12, color: "#64748b" }}>citas</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
