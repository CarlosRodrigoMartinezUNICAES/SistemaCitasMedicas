import { useEffect, useState } from "react";
import { CalendarDays, Users, ClipboardList, BarChart2, ArrowLeft, Clock, User, Stethoscope } from "lucide-react";

type DoctorCalendarioProps = {
  id_usuario?: string;
  onBack?: () => void;
  onNavigate?: (page: 'calendario' | 'citas' | 'pacientes' | 'reportes') => void;
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

export default function DoctorCalendario({ id_usuario, onBack, onNavigate }: DoctorCalendarioProps) {
  const [doctor, setDoctor] = useState<DoctorInfo | null>(null);
  const [stats, setStats] = useState<DoctorStats>({
    total_citas: 0,
    citas_hoy: 0,
    citas_pendientes: 0,
    total_pacientes: 0
  });
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    if (!id_usuario) return;
    fetchDoctorData();
  }, [id_usuario]);

  const fetchDoctorData = async () => {
    setLoading(true);
    try {
      console.log('Fetching doctor data for id_usuario=', id_usuario);
      
      // Fetch doctor info and stats
      const res = await fetch(`http://localhost:3000/api/doctor/${encodeURIComponent(id_usuario)}`);
      const data = await res.json();
      console.log('Doctor fetch response:', data);
      
      if (data.success) {
        setDoctor(data.doctor);
        setStats(data.stats);
        setAppointments(data.appointments || []);
      } else {
        console.warn('Doctor not found or error', data);
      }
    } catch (err) {
      console.error('Error fetching doctor data', err);
    } finally {
      setLoading(false);
    }
  };

  const generateCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayAppointments = appointments.filter(apt => apt.fecha === dateStr);
      days.push({
        day,
        appointments: dayAppointments,
        isToday: new Date().toDateString() === new Date(year, month, day).toDateString()
      });
    }
    
    return days;
  };

  const getMonthName = () => {
    const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 
                   'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
    return months[currentDate.getMonth()];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
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

        {/* Navegación */}
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #e5e7eb", paddingBottom: 12, marginBottom: 24 }}>
          <button 
            style={{ fontWeight: 600, color: "#222", borderBottom: "2px solid #222", paddingBottom: 4, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}
          >
            Calendario
          </button>
          <button 
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.('citas')}
          >
            Citas
          </button>
          <button 
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.('pacientes')}
          >
            Pacientes
          </button>
          <button 
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.('reportes')}
          >
            Reportes
          </button>
        </div>

        {/* Calendario */}
        <div style={{ background: "#f1f5f9", padding: 24, borderRadius: 12 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 600, margin: 0 }}>
              {getMonthName()} {currentDate.getFullYear()}
            </h2>
            <div style={{ display: "flex", gap: 8 }}>
              <button 
                style={{ ...buttonStyle, background: "#fff", color: "#222", border: "1px solid #e5e7eb" }}
                onClick={() => navigateMonth('prev')}
              >
                ← Mes
              </button>
              <button 
                style={{ ...buttonStyle, background: "#fff", color: "#222", border: "1px solid #e5e7eb" }}
                onClick={() => navigateMonth('next')}
              >
                Semana →
              </button>
            </div>
          </div>

          {/* Días de la semana */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginBottom: 8 }}>
            {['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'].map(day => (
              <div key={day} style={{ textAlign: "center", fontWeight: 600, color: "#64748b", padding: 8 }}>
                {day}
              </div>
            ))}
          </div>

          {/* Días del mes */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8 }}>
            {generateCalendarDays().map((dayData, index) => (
              <div
                key={index}
                style={{
                  height: 80,
                  border: "1px solid #e5e7eb",
                  borderRadius: 8,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  background: dayData ? "#fff" : "transparent",
                  borderColor: dayData?.isToday ? "#3b82f6" : "#e5e7eb",
                  backgroundColor: dayData?.isToday ? "#eff6ff" : dayData ? "#fff" : "transparent"
                }}
              >
                {dayData && (
                  <>
                    <span style={{ fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
                      {dayData.day}
                    </span>
                    {dayData.appointments.length > 0 && (
                      <div style={{ display: "flex", gap: 2 }}>
                        {dayData.appointments.slice(0, 3).map((apt, aptIndex) => (
                          <div
                            key={aptIndex}
                            style={{
                              width: 6,
                              height: 6,
                              borderRadius: "50%",
                              background: apt.estado === 'Confirmada' ? "#10b981" : 
                                        apt.estado === 'Pendiente' ? "#f59e0b" : "#ef4444"
                            }}
                          />
                        ))}
                        {dayData.appointments.length > 3 && (
                          <span style={{ fontSize: 10, color: "#64748b" }}>+{dayData.appointments.length - 3}</span>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Citas del día actual */}
        {loading ? (
          <div style={{ color: "#64748b", fontSize: 16, marginTop: 24 }}>Cargando citas...</div>
        ) : (
          <div style={{ marginTop: 24 }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 16 }}>
              Citas para hoy ({new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })})
            </h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {appointments.filter(apt => apt.fecha === new Date().toISOString().split('T')[0]).length === 0 ? (
                <div style={{ color: "#64748b", fontSize: 16, textAlign: "center", padding: 24 }}>
                  No hay citas agendadas para hoy
                </div>
              ) : (
                appointments
                  .filter(apt => apt.fecha === new Date().toISOString().split('T')[0])
                  .sort((a, b) => a.hora.localeCompare(b.hora))
                  .map((appointment) => (
                    <div key={appointment.id_cita} style={{ ...cardStyle, border: "2px dotted #60a5fa", textAlign: "left" }}>
                      <p style={{ 
                        fontSize: 12, 
                        color: appointment.estado === 'Pendiente' ? "#dc2626" : 
                              appointment.estado === 'Confirmada' ? "#16a34a" : "#2563eb", 
                        fontWeight: 600, 
                        marginBottom: 8 
                      }}>
                        {appointment.estado}
                      </p>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", marginBottom: 4 }}>
                        <Clock size={16} />
                        <p>{appointment.hora.slice(0, 5)}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155", marginBottom: 4 }}>
                        <User size={16} />
                        <p>{appointment.paciente_nombre}</p>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 8, color: "#334155" }}>
                        <Stethoscope size={16} />
                        <p>{doctor?.especialidad}</p>
                      </div>
                    </div>
                  ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
