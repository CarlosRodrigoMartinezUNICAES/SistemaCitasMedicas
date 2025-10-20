import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

interface CitaData {
  fecha: string;
  hora: string;
  paciente_nombre: string;
  especialidad_nombre: string;
  estado: string;
  doctor_nombre: string;
}

interface ConsultaData {
  reporte_paciente: string;
  fecha_consulta: string;
  createdAt: string;
  updatedAt: string;
}

interface FormData {
  reporte_paciente: string;
}

const DoctorConsulta: React.FC = () => {
  const { citaId } = useParams<{ citaId: string }>();
  const navigate = useNavigate();
  const [cita, setCita] = useState<CitaData | null>(null);
  const [consulta, setConsulta] = useState<ConsultaData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    reporte_paciente: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [citaRes, consultaRes] = await Promise.all([
          axios.get(`/api/citas/${citaId}`),
          axios.get(`/api/citas/${citaId}/consulta`).catch(() => ({ data: { success: false } }))
        ]);

        if (citaRes.data.success) {
          setCita(citaRes.data.data);
        }

        if (consultaRes.data.success && consultaRes.data.data) {
          setConsulta(consultaRes.data.data);
          setFormData({
            reporte_paciente: consultaRes.data.data.reporte_paciente || ''
          });
        }
      } catch (err: any) {
        console.error('Error fetching data:', err);
        setError('No se pudo cargar la información de la cita');
        if (err.response?.status === 404) {
          setError('Cita no encontrada');
        }
      } finally {
        setLoading(false);
      }
    };

    if (citaId) {
      fetchData();
    }
  }, [citaId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.reporte_paciente.trim()) {
      setError('El reporte del paciente es requerido');
      return;
    }

    try {
      setLoading(true);
      const url = `/api/citas/${citaId}/consulta`;
      
      const response = consulta
        ? await axios.put(url, formData)
        : await axios.post(url, formData);

      if (response.data.success) {
        setConsulta(response.data.data);
        setIsEditing(false);
        setError('');
      }
    } catch (err: any) {
      console.error('Error saving consultation:', err);
      setError(err.response?.data?.message || 'Error al guardar la consulta');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      timeZone: 'UTC'
    };
    return new Date(dateString).toLocaleDateString('es-ES', options);
  };

  const formatTime = (timeString: string) => {
    return timeString.substring(0, 5);
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (consulta) {
      setFormData({ reporte_paciente: consulta.reporte_paciente || '' });
    } else {
      setFormData({ reporte_paciente: '' });
    }
    setError('');
  };

  if (loading && !cita) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error && !cita) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <div className="mt-2">
              <button
                onClick={() => navigate(-1)}
                className="text-sm font-medium text-blue-600 hover:text-blue-500"
              >
                ← Volver atrás
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back button */}
      <div className="mb-6">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-sm font-medium text-blue-600 hover:text-blue-500"
        >
          <svg className="h-5 w-5 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Volver a la lista de citas
        </button>
        <h1 className="mt-2 text-2xl font-bold text-gray-900">
          {consulta ? 'Detalles de la Consulta' : 'Nueva Consulta'}
        </h1>
      </div>

      {/* Appointment Information Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-8">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Información de la Cita
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {cita && `Programada para el ${formatDate(cita.fecha)} a las ${formatTime(cita.hora)}`}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
          <dl className="grid grid-cols-1 gap-x-4 gap-y-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Paciente</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {cita?.paciente_nombre}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Especialidad</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {cita?.especialidad_nombre}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Médico</dt>
              <dd className="mt-1 text-sm text-gray-900">
                {cita?.doctor_nombre}
              </dd>
            </div>
            <div className="sm:col-span-1">
              <dt className="text-sm font-medium text-gray-500">Estado</dt>
              <dd className="mt-1">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                  cita?.estado === 'Atendida' ? 'bg-green-100 text-green-800' :
                  cita?.estado === 'Cancelada' ? 'bg-red-100 text-red-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {cita?.estado}
                </span>
              </dd>
            </div>
            {consulta && (
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Fecha de la consulta</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {formatDate(consulta.fecha_consulta)}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>

      {/* Consulta Report Card */}
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200 flex justify-between items-center">
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              {consulta ? 'Reporte de Consulta' : 'Nuevo Reporte'}
            </h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              {consulta 
                ? `Última actualización: ${new Date(consulta.updatedAt || consulta.createdAt).toLocaleString('es-ES')}`
                : 'Complete el formulario para registrar la consulta'}
            </p>
          </div>
          {!isEditing && consulta?.reporte_paciente && (
            <button
              onClick={() => setIsEditing(true)}
              className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Editar
            </button>
          )}
        </div>

        <div className="px-4 py-5 sm:p-6">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="reporte_paciente" className="block text-sm font-medium text-gray-700 mb-2">
                  Reporte del Paciente
                </label>
                <textarea
                  id="reporte_paciente"
                  name="reporte_paciente"
                  rows={8}
                  className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                  placeholder="Describa los hallazgos, diagnóstico y tratamiento..."
                  value={formData.reporte_paciente}
                  onChange={handleInputChange}
                  required
                />
              </div>

              {error && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">
                        {error}
                      </h3>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Guardando...
                    </>
                  ) : 'Guardar'}
                </button>
              </div>
            </form>
          ) : (
            <>
              {consulta?.reporte_paciente ? (
                <div>
                  <pre className="whitespace-pre-wrap font-sans text-gray-800">{consulta.reporte_paciente}</pre>
                </div>
              ) : (
                <div className="text-center py-12 border-2 border-dashed border-gray-300 rounded-lg">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reporte registrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Comience agregando un nuevo reporte para esta consulta.
                  </p>
                  <div className="mt-6">
                    <button
                      type="button"
                      onClick={() => setIsEditing(true)}
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 shadow-sm"
                    >
                      <svg
                        className="-ml-1 mr-2 h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      Agregar Reporte
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DoctorConsulta;