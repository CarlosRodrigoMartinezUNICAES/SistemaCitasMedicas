import { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';

type Props = {
  id_usuario?: string;
  onBack?: () => void;
  onCreated?: (citaId: string) => void;
};

type Especialidad = {
  id_especialidad: string;
  nombre: string;
  descripcion: string;
};

type Doctor = {
  id_doctor: string;
  nombre_completo: string;
  codigo_trabajador: string;
  telefono: string;
  especialidad: string;
};

export default function AgendarCita({ id_usuario, onBack, onCreated }: Props) {
  const [especialidad, setEspecialidad] = useState('');
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [doctor, setDoctor] = useState('');
  const [doctores, setDoctores] = useState<Doctor[]>([]);
  const [hora, setHora] = useState('09:00');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [loadingDoctores, setLoadingDoctores] = useState(false);
  const [checkingConflict, setCheckingConflict] = useState(false);
  const [loadingAvailability, setLoadingAvailability] = useState(false);
  const [busySlots, setBusySlots] = useState<Array<{start: string, end: string}>>([]);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchEspecialidades();
  }, []);

  useEffect(() => {
    if (especialidad) {
      fetchDoctoresByEspecialidad(especialidad);
    } else {
      setDoctores([]);
      setDoctor('');
    }
  }, [especialidad]);

  useEffect(() => {
    if (doctor && fecha) {
      fetchDoctorAvailability(doctor, fecha);
    } else {
      setBusySlots([]);
    }
  }, [doctor, fecha]);

  const fetchDoctorAvailability = async (doctorId: string, selectedDate: string) => {
    if (!doctorId || !selectedDate) return;
    
    setLoadingAvailability(true);
    try {
      const res = await fetch(`http://localhost:3000/api/cita/disponibilidad/${doctorId}/${selectedDate}`);
      const data = await res.json();
      
      if (data.success) {
        setBusySlots(data.busySlots || []);
      } else {
        console.error('Error fetching availability:', data.message);
        setBusySlots([]);
      }
    } catch (err) {
      console.error('Error fetching doctor availability', err);
      setBusySlots([]);
    } finally {
      setLoadingAvailability(false);
    }
  };

  const isTimeSlotBlocked = (checkTime: string) => {
    return busySlots.some(slot => {
      // Check if the requested time falls within any busy slot
      // A time is blocked if: checkTime >= slot.start AND checkTime < slot.end
      return checkTime >= slot.start && checkTime < slot.end;
    });
  };

  // Generate time slots from 7:00 AM to 7:00 PM (adjust as needed)
  const generateTimeSlots = () => {
    const slots = [];
    for (let hour = 7; hour <= 19; hour++) { // 7 AM to 7 PM
      slots.push(`${hour.toString().padStart(2, '0')}:00`);
      slots.push(`${hour.toString().padStart(2, '0')}:30`); // Include half-hour slots
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  const fetchEspecialidades = async () => {
    setLoadingEspecialidades(true);
    try {
      const res = await fetch('http://localhost:3000/api/cita/especialidades/list');
      const data = await res.json();
      if (data.success) {
        setEspecialidades(data.especialidades);
      }
    } catch (err) {
      console.error('Error fetching especialidades', err);
    } finally {
      setLoadingEspecialidades(false);
    }
  };

  const fetchDoctoresByEspecialidad = async (especialidadId: string) => {
    setLoadingDoctores(true);
    console.log('Fetching doctors for specialty ID:', especialidadId);
    try {
      const res = await fetch(`http://localhost:3000/api/especialidad/${especialidadId}/doctores`);
      console.log('Response status:', res.status);
      const data = await res.json();
      console.log('Response data:', data);
      if (data.success) {
        setDoctores(data.data);
        console.log('Doctors set:', data.data);
      } else {
        console.error('Error fetching doctors:', data.message);
        setDoctores([]);
      }
    } catch (err) {
      console.error('Error fetching doctores by especialidad', err);
      setDoctores([]);
    } finally {
      setLoadingDoctores(false);
    }
  };

  const checkForConflict = async (doctorId: string, fecha: string, hora: string) => {
    setCheckingConflict(true);
    try {
      const res = await fetch(`http://localhost:3000/api/cita/check-conflict?fecha=${encodeURIComponent(fecha)}&hora=${encodeURIComponent(hora)}&id_doctor=${encodeURIComponent(doctorId)}`);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error('Error checking for conflict', err);
      return { success: false, hasConflict: true, message: 'Error verificando conflictos' };
    } finally {
      setCheckingConflict(false);
    }
  };

  const handleSubmit = async () => {
    if (!id_usuario) return setMessage('Usuario no identificado');
    if (!fecha || !hora || !especialidad || !doctor) return setMessage('Fecha, hora, especialidad y doctor son requeridos');

    // Get the specialty name based on the selected ID
    const selectedEspecialidad = especialidades.find(esp => esp.id_especialidad === especialidad);
    if (!selectedEspecialidad) {
      setMessage('Especialidad no válida');
      return;
    }

    // Double check that the selected time is not in a busy slot (UI should prevent this, but as an extra check)
    if (isTimeSlotBlocked(hora)) {
      setMessage('La hora seleccionada ya está ocupada. Por favor, seleccione otra hora.');
      return;
    }

    // Check for conflicts before submitting
    setLoading(true);
    setMessage(null);
    
    try {
      // Check if there's already an appointment for this doctor at this time
      const conflictCheck = await checkForConflict(doctor, fecha, hora);
      
      if (conflictCheck.success && conflictCheck.hasConflict) {
        setMessage(conflictCheck.message || 'El doctor ya tiene una cita agendada en esta fecha y hora');
        setLoading(false);
        return;
      } else if (!conflictCheck.success) {
        setMessage(conflictCheck.message || 'Error verificando conflictos');
        setLoading(false);
        return;
      }

      const res = await fetch('http://localhost:3000/api/cita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id_paciente: id_usuario, 
          fecha, 
          hora, 
          especialidad: selectedEspecialidad.nombre,  // Send the name, not the ID
          id_doctor: doctor 
        })
      });

      const data = await res.json();
      if (data.success) {
        setMessage('Cita agendada correctamente');
        onCreated && onCreated(data.cita.id_cita);
      } else {
        setMessage(data.message || 'Error al agendar cita');
      }
    } catch (err) {
      console.error('Error creating cita', err);
      setMessage('Error del servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, background: '#f8fafc', minHeight: '100vh', display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 720, background: '#fff', borderRadius: 16, padding: 20 }}>
        <button style={{ background: 'transparent', border: 'none', color: '#222', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }} onClick={() => onBack && onBack()}>
          <ArrowLeft size={16} /> Regresar
        </button>
        <h2 style={{ fontSize: 20, fontWeight: 600, marginBottom: 12 }}>Agendar Nueva Cita</h2>

        <div style={{ display: 'grid', gap: 12 }}>
          <div>
            <p style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>Especialidad Médica *</p>
            <select 
              value={especialidad} 
              onChange={e => setEspecialidad(e.target.value)} 
              disabled={loadingEspecialidades}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}
            >
              <option value="">Seleccione una especialidad</option>
              {especialidades.map(esp => (
                <option key={esp.id_especialidad} value={esp.id_especialidad}>
                  {esp.nombre}
                </option>
              ))}
            </select>
            {loadingEspecialidades && (
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Cargando especialidades...</p>
            )}
          </div>

          <div>
            <p style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>Doctor *</p>
            <select 
              value={doctor} 
              onChange={e => setDoctor(e.target.value)} 
              disabled={loadingDoctores || !especialidad}
              style={{ width: '100%', padding: 10, borderRadius: 8, border: '1px solid #e5e7eb', background: '#fff' }}
            >
              <option value="">Seleccione un doctor</option>
              {doctores.map(doc => (
                <option key={doc.id_doctor} value={doc.id_doctor}>
                  {doc.nombre_completo} ({doc.codigo_trabajador})
                </option>
              ))}
            </select>
            {loadingDoctores && (
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Cargando doctores...</p>
            )}
            {!especialidad && (
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Seleccione una especialidad primero</p>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
            <div>
              <p style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>Fecha</p>
              <input type="date" value={fecha} onChange={e => setFecha(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            </div>
            {fecha && doctor && (
              <div>
                <p style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>Hora <span style={{fontSize: 10, color: '#64748b'}}>(Seleccione un horario)</span></p>
                <div style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: 8, padding: 8 }}>
                  {loadingAvailability ? (
                    <p style={{ textAlign: 'center', padding: '10px', color: '#64748b' }}>Cargando disponibilidad...</p>
                  ) : busySlots.length === 0 && timeSlots.length > 0 ? (
                    <p style={{ textAlign: 'center', padding: '10px', color: '#16a34a', fontSize: 12 }}>Todo el día está disponible</p>
                  ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 6 }}>
                      {timeSlots.map((timeSlot) => {
                        const isBlocked = isTimeSlotBlocked(timeSlot);
                        const isSelected = hora === timeSlot;
                        return (
                          <button
                            key={timeSlot}
                            onClick={() => !isBlocked && setHora(timeSlot)}
                            disabled={isBlocked}
                            style={{
                              padding: '6px 8px',
                              borderRadius: 6,
                              border: '1px solid #e2e8f0',
                              background: isBlocked 
                                ? '#fee2e2' // Red for busy
                                : isSelected
                                ? '#dbeafe' // Blue for selected
                                : '#f1f5f9', // Gray for available
                              color: isBlocked ? '#991b1b' : isSelected ? '#1e40af' : '#475569',
                              cursor: isBlocked ? 'not-allowed' : 'pointer',
                              fontSize: 11,
                              textAlign: 'center',
                              opacity: isBlocked ? 0.7 : 1
                            }}
                          >
                            {timeSlot}
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
            {(!fecha || !doctor) && (
              <div>
                <p style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>Hora</p>
                <input 
                  type="time" 
                  value={hora} 
                  onChange={e => setHora(e.target.value)} 
                  style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} 
                  disabled={!fecha || !doctor}
                />
                <p style={{ fontSize: 10, color: '#64748b', marginTop: 4 }}>Seleccione fecha y doctor para ver disponibilidad</p>
              </div>
            )}
          </div>

          {(fecha && doctor) && (
            <div style={{ display: 'flex', gap: 12, marginTop: 8, fontSize: 10, color: '#64748b' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, background: '#f1f5f9', border: '1px solid #e2e8f0' }}></div>
                <span>Disponible</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, background: '#fee2e2', border: '1px solid #e2e8f0' }}></div>
                <span>Ocupado</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 10, height: 10, background: '#dbeafe', border: '1px solid #e2e8f0' }}></div>
                <span>Seleccionado</span>
              </div>
            </div>
          )}
          {(fecha && hora && doctor) && checkingConflict && (
            <p style={{ fontSize: 11, color: '#64748b', marginTop: 4, textAlign: 'center' }}>Verificando disponibilidad del doctor...</p>
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 8 }}>
            <button style={{ background: 'transparent', border: 'none', color: '#64748b' }} onClick={() => onBack && onBack()}>Cancelar</button>
            <button disabled={loading} onClick={handleSubmit} style={{ background: '#222', color: '#fff', padding: '10px 18px', borderRadius: 8 }}>{loading ? 'Guardando...' : 'Agendar Cita'}</button>
          </div>

          {message && (
            <div style={{ marginTop: 8, padding: 8, borderRadius: 8, background: message.includes('correct') || message.includes('correcto') ? '#ecfedf' : '#fee2e2', color: message.includes('correct') || message.includes('correcto') ? '#166534' : '#991b1b' }}>
              {message}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
