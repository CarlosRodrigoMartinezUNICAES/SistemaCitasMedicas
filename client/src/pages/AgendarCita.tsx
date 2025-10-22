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

  const handleSubmit = async () => {
    if (!id_usuario) return setMessage('Usuario no identificado');
    if (!fecha || !hora || !especialidad || !doctor) return setMessage('Fecha, hora, especialidad y doctor son requeridos');

    // Get the specialty name based on the selected ID
    const selectedEspecialidad = especialidades.find(esp => esp.id_especialidad === especialidad);
    if (!selectedEspecialidad) {
      setMessage('Especialidad no válida');
      return;
    }

    setLoading(true);
    setMessage(null);
    try {
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
            <div>
              <p style={{ fontSize: 12, color: '#334155', marginBottom: 6 }}>Hora</p>
              <input type="time" value={hora} onChange={e => setHora(e.target.value)} style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #e5e7eb' }} />
            </div>
          </div>

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
