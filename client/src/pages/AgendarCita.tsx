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

export default function AgendarCita({ id_usuario, onBack, onCreated }: Props) {
  const [especialidad, setEspecialidad] = useState('');
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  const [hora, setHora] = useState('09:00');
  const [fecha, setFecha] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingEspecialidades, setLoadingEspecialidades] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    fetchEspecialidades();
  }, []);

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

  const handleSubmit = async () => {
    if (!id_usuario) return setMessage('Usuario no identificado');
    if (!fecha || !hora || !especialidad) return setMessage('Fecha, hora y especialidad son requeridos');

    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch('http://localhost:3000/api/cita', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id_paciente: id_usuario, fecha, hora, especialidad })
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
                <option key={esp.id_especialidad} value={esp.nombre}>
                  {esp.nombre}
                </option>
              ))}
            </select>
            {loadingEspecialidades && (
              <p style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Cargando especialidades...</p>
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
