import React, { useState } from 'react';
import axios from 'axios';

interface ConsultaFormProps {
  citaId: string;
  userId: string;
  userType: string;
  onSuccess?: () => void;
  onCancel?: () => void;
  initialData?: {
    reporte_paciente: string;
  };
}

const ConsultaForm: React.FC<ConsultaFormProps> = ({ 
  citaId, 
  userId,
  userType,
  onSuccess, 
  onCancel,
  initialData 
}) => {
  const simpleButtonStyle: React.CSSProperties = {
    border: '1px solid #ccc',
    padding: '8px 12px',
    borderRadius: '6px',
    color: '#333',
    background: '#fff',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  };
  const [reporte, setReporte] = useState(initialData?.reporte_paciente || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!reporte.trim() || reporte.trim().length < 10) {
      setError('El reporte del paciente es requerido y debe tener al menos 10 caracteres');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      await axios.post(`http://localhost:3000/api/citas/${citaId}/consulta`, {
        reporte_paciente: reporte
      }, {
        headers: {
          'x-user-id': userId,
          'x-user-type': userType
        }
      });
      
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Error al guardar la consulta:', err);
      if (err.response) {
        console.error('Error response:', err.response);
        console.error('Error response data:', err.response.data);
        setError(err.response.data.message || `Error del servidor: ${err.response.status}`);
      } else if (err.request) {
        console.error('Error request:', err.request);
        setError('No se recibió respuesta del servidor');
      } else {
        console.error('Error message:', err.message);
        setError(`Error en la configuración de la solicitud: ${err.message}`);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          {initialData ? 'Editar Consulta' : 'Nueva Consulta'}
        </h3>
        
        {error && (
          <div className="mt-4 bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <form className="mt-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="reporte" className="block text-sm font-medium text-gray-700">
              Reporte del Paciente
            </label>
            <div className="mt-1">
              <textarea
                id="reporte"
                rows={8}
                className="shadow-sm focus:ring-blue-500 focus:border-blue-500 mt-1 block w-full sm:text-sm border border-gray-300 rounded-md"
                placeholder="Detalles de la consulta, diagnóstico, tratamiento, etc."
                value={reporte}
                onChange={(e) => setReporte(e.target.value)}
                disabled={isSubmitting}
              />
            </div>
            <p className="mt-2 text-sm text-gray-500">
              Incluya todos los detalles relevantes de la consulta.
            </p>
          </div>

          <div className="mt-5 flex justify-end space-x-3">
            {onCancel && (
              <button
                type="button"
                onClick={onCancel}
                disabled={isSubmitting}
                style={simpleButtonStyle}
              >
                Cancelar
              </button>
            )}
            <button
              type="submit"
              disabled={isSubmitting}
              style={{...simpleButtonStyle, background: '#3b82f6', color: 'white', border: 'none'}}
            >
              {isSubmitting ? 'Guardando...' : 'Guardar Consulta'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultaForm;
