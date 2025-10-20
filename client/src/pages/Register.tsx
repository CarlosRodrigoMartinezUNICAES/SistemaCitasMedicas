import React, { useState } from 'react';
import axios from 'axios';

interface RegisterProps {
  onBack: () => void;
  onSuccess: (userId: string, tipo: string) => void;
}

const Register: React.FC<RegisterProps> = ({ onBack, onSuccess }) => {
  interface Especialidad {
    id_especialidad: string;
    nombre: string;
    descripcion: string;
  }

  const [formData, setFormData] = useState({
    tipo_usuario: 'Paciente',
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    fecha_nacimiento: '',
    dui: '',
    password: '',
    confirmPassword: '',
    doctorPassword: '',
    especialidad: 'E0001',
  });
  
  const [especialidades, setEspecialidades] = useState<Especialidad[]>([]);
  
  // Load specialties when component mounts
  React.useEffect(() => {
    const loadEspecialidades = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/especialidades');
        if (response.data.success && Array.isArray(response.data.data) && response.data.data.length > 0) {
          const sortedEspecialidades = [...response.data.data].sort((a, b) => 
            a.id_especialidad.localeCompare(b.id_especialidad)
          );
          setEspecialidades(sortedEspecialidades);
          
          setFormData(prev => ({
            ...prev,
            especialidad: prev.especialidad || sortedEspecialidades[0]?.id_especialidad || ''
          }));
        }
      } catch (error) {
        console.error('Error loading specialties:', error);
        setGeneralError('Error al cargar las especialidades');
      }
    };
    
    loadEspecialidades();
  }, []);
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState('');

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.nombre.trim()) newErrors.nombre = 'El nombre es requerido';
    if (!formData.apellido.trim()) newErrors.apellido = 'El apellido es requerido';
    if (!formData.email.trim()) {
      newErrors.email = 'El correo electrónico es requerido';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.telefono.trim()) {
      newErrors.telefono = 'El teléfono es requerido';
    } else if (!/^[267][0-9]{7}$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono debe comenzar con 2, 6 o 7 y tener 8 dígitos';
    }
    
    if (!formData.fecha_nacimiento) {
      newErrors.fecha_nacimiento = 'La fecha de nacimiento es requerida';
    } else {
      const birthDate = new Date(formData.fecha_nacimiento);
      const today = new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      
      if (age < 18) {
        newErrors.fecha_nacimiento = 'Debes ser mayor de 18 años para registrarte';
      }
    }
    
    if (!formData.dui.trim()) {
      newErrors.dui = 'El DUI es requerido';
    } else if (!/^\d{8}-\d$/.test(formData.dui)) {
      newErrors.dui = 'El formato del DUI debe ser 12345678-9';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es requerida';
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
    }
    
    if (formData.tipo_usuario === 'Doctor') {
      if (!formData.doctorPassword) {
        newErrors.doctorPassword = 'La contraseña de doctor es requerida';
      } else if (formData.doctorPassword !== '1234') {
        newErrors.doctorPassword = 'Contraseña de doctor incorrecta';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
    
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    if (formData.tipo_usuario === 'Doctor' && !formData.especialidad) {
      setGeneralError('Por favor espere mientras se cargan las especialidades');
      return;
    }
    
    setIsSubmitting(true);
    setGeneralError('');
    
    try {
      const isDoctor = formData.tipo_usuario === 'Doctor';
      const userData = isDoctor ? {
        username: formData.email,
        password: formData.password,
        nombre_completo: `${formData.nombre} ${formData.apellido}`,
        codigo_trabajador: formData.doctorPassword,
        telefono: formData.telefono,
        id_especialidad: formData.especialidad
      } : {
        username: formData.email,
        password: formData.password,
        nombre_completo: `${formData.nombre} ${formData.apellido}`,
        telefono: formData.telefono,
        correo: formData.email,
        edad: calculateAge(formData.fecha_nacimiento),
        dui: formData.dui,
      };
      
      console.log('Sending registration data:', userData);
      
      const endpoint = formData.tipo_usuario === 'Paciente' 
        ? 'http://localhost:3000/api/usuarios/register/paciente'
        : 'http://localhost:3000/api/usuarios/register/doctor';
      
      console.log('Calling endpoint:', endpoint);
      
      const response = await axios.post(endpoint, userData);
      console.log('Registration response:', response.data);
      
      if (response.data.success) {
        onSuccess(response.data.userId, formData.tipo_usuario);
      } else {
        setGeneralError(response.data.message || 'Error en el registro. Por favor, inténtalo de nuevo.');
      }
    } catch (error: any) {
      console.error('Registration error:', error);
      console.error('Error response data:', error.response?.data);
      console.error('Error status:', error.response?.status);
      console.error('Error headers:', error.response?.headers);
      
      const errorMessage = error.response?.data?.message || 
                         error.message || 
                         'Error en el servidor. Por favor, inténtalo más tarde.';
      
      setGeneralError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Registro de Usuario</h2>
        
        {generalError && (
          <div style={styles.errorAlert}>
            {generalError}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="tipo_usuario" style={styles.label}>
              Tipo de Usuario
            </label>
            <select
              id="tipo_usuario"
              name="tipo_usuario"
              value={formData.tipo_usuario}
              onChange={handleChange}
              style={styles.select}
            >
              <option value="Paciente">Paciente</option>
              <option value="Doctor">Doctor</option>
            </select>
          </div>
          
          {formData.tipo_usuario === 'Doctor' && (
            <div style={styles.formGroup}>
              <label htmlFor="doctorPassword" style={styles.label}>
                Código de Trabajador
              </label>
              <input
                type="password"
                id="doctorPassword"
                name="doctorPassword"
                value={formData.doctorPassword}
                onChange={handleChange}
                style={styles.input}
                placeholder="Ingresa tu código de trabajador"
              />
              {errors.doctorPassword && (
                <span style={styles.error}>{errors.doctorPassword}</span>
              )}
            </div>
          )}
          
          <div style={styles.formGroup}>
            <label htmlFor="nombre" style={styles.label}>
              Nombre
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ingresa tu nombre"
            />
            {errors.nombre && <span style={styles.error}>{errors.nombre}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="apellido" style={styles.label}>
              Apellido
            </label>
            <input
              type="text"
              id="apellido"
              name="apellido"
              value={formData.apellido}
              onChange={handleChange}
              style={styles.input}
              placeholder="Ingresa tu apellido"
            />
            {errors.apellido && <span style={styles.error}>{errors.apellido}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={styles.input}
              placeholder="ejemplo@correo.com"
            />
            {errors.email && <span style={styles.error}>{errors.email}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="telefono" style={styles.label}>
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              style={styles.input}
              placeholder="12345678"
            />
            {errors.telefono && <span style={styles.error}>{errors.telefono}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="fecha_nacimiento" style={styles.label}>
              Fecha de Nacimiento
            </label>
            <input
              type="date"
              id="fecha_nacimiento"
              name="fecha_nacimiento"
              value={formData.fecha_nacimiento}
              onChange={handleChange}
              style={styles.input}
              max={new Date().toISOString().split('T')[0]}
            />
            {errors.fecha_nacimiento && (
              <span style={styles.error}>{errors.fecha_nacimiento}</span>
            )}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="dui" style={styles.label}>
              DUI (Formato: 12345678-9)
            </label>
            <input
              type="text"
              id="dui"
              name="dui"
              value={formData.dui}
              onChange={handleChange}
              style={styles.input}
              placeholder="12345678-9"
            />
            {errors.dui && <span style={styles.error}>{errors.dui}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
              placeholder="Mínimo 8 caracteres"
            />
            {errors.password && <span style={styles.error}>{errors.password}</span>}
          </div>
          
          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirmar Contraseña
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
              placeholder="Confirma tu contraseña"
            />
            {errors.confirmPassword && (
              <span style={styles.error}>{errors.confirmPassword}</span>
            )}
          </div>
          
          <div style={styles.buttonGroup}>
            <button
              type="button"
              onClick={onBack}
              style={styles.secondaryButton}
              disabled={isSubmitting}
            >
              Cancelar
            </button>
            <button
              type="submit"
              style={styles.primaryButton}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>
        </form>
        
        <div style={styles.loginLink}>
          ¿Ya tienes una cuenta?{' '}
          <button
            type="button"
            onClick={onBack}
            style={styles.linkButton}
          >
            Inicia sesión aquí
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    backgroundColor: '#f0f9ff',
    padding: '20px',
  } as React.CSSProperties,
  card: {
    background: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    padding: '32px',
    width: '100%',
    maxWidth: '500px',
  } as React.CSSProperties,
  title: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#1e293b',
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  form: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '16px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '6px',
  },
  label: {
    fontSize: '14px',
    fontWeight: 500,
    color: '#334155',
  },
  input: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  select: {
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    backgroundColor: 'white',
    cursor: 'pointer',
  } as React.CSSProperties,
  error: {
    color: '#dc2626',
    fontSize: '12px',
    marginTop: '2px',
  } as React.CSSProperties,
  errorAlert: {
    backgroundColor: '#fee2e2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '16px',
    fontSize: '14px',
    textAlign: 'center' as const,
  } as React.CSSProperties,
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    marginTop: '16px',
  } as React.CSSProperties,
  primaryButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: 'none',
    backgroundColor: '#3b82f6',
    color: 'white',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'background-color 0.2s',
  } as React.CSSProperties,
  secondaryButton: {
    flex: 1,
    padding: '12px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    backgroundColor: 'white',
    color: '#334155',
    fontSize: '14px',
    fontWeight: 500,
    cursor: 'pointer',
    transition: 'all 0.2s',
  } as React.CSSProperties,
  loginLink: {
    marginTop: '20px',
    textAlign: 'center' as const,
    fontSize: '14px',
    color: '#64748b',
  } as React.CSSProperties,
  linkButton: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    textDecoration: 'underline',
    cursor: 'pointer',
    padding: 0,
    fontSize: '14px',
    fontWeight: 500,
  } as React.CSSProperties,
};

export default Register;