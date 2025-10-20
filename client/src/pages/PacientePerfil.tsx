import { Phone, Calendar, ArrowLeft, Edit3, Save, X } from "lucide-react";
import { useEffect, useState } from "react";
import axios from 'axios';

// Minimal input component
const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} style={{ maxWidth: 320, width: '100%', margin: '0 auto', padding: '8px 10px', borderRadius: 8, border: '1px solid #e5e7eb', ...props.style }} />
);

type PacientePerfilProps = {
  id_usuario?: string;
  onBack?: () => void;
  onNavigate?: (page: 'citas' | 'historial' | 'perfil' | 'agendar') => void;
};

export default function PacientePerfil({ id_usuario, onBack, onNavigate }: PacientePerfilProps) {
  const [paciente, setPaciente] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  
  // Form state
  const [formData, setFormData] = useState({
    nombre_completo: "",
    telefono: "",
    correo: "",
    edad: "",
    dui: ""
  });

  useEffect(() => {
    if (!id_usuario) return;
    const fetchPaciente = async () => {
      try {
        const res = await fetch(`http://localhost:3000/api/paciente/${encodeURIComponent(id_usuario)}`);
        const data = await res.json();
        if (data.success) {
          setPaciente(data.paciente);
          // Initialize form data with current patient data
          setFormData({
            nombre_completo: data.paciente.nombre_completo || "",
            telefono: data.paciente.telefono || "",
            correo: data.paciente.correo || "",
            edad: data.paciente.edad?.toString() || "",
            dui: data.paciente.dui || ""
          });
        }
      } catch (err) {
        console.error('Error fetching paciente', err);
        setError("Error al cargar la información del paciente");
      }
    };
    fetchPaciente();
  }, [id_usuario]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear messages when user starts typing
    if (error) setError("");
    if (success) setSuccess("");
  };

  const handleEdit = () => {
    setIsEditing(true);
    setError("");
    setSuccess("");
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset form data to original patient data
    if (paciente) {
      setFormData({
        nombre_completo: paciente.nombre_completo || "",
        telefono: paciente.telefono || "",
        correo: paciente.correo || "",
        edad: paciente.edad?.toString() || "",
        dui: paciente.dui || ""
      });
    }
    setError("");
    setSuccess("");
  };

  const handleSave = async () => {
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.put(`http://localhost:3000/api/paciente/${encodeURIComponent(id_usuario!)}`, {
        nombre_completo: formData.nombre_completo,
        telefono: formData.telefono,
        correo: formData.correo,
        edad: parseInt(formData.edad),
        dui: formData.dui
      });

      if (response.data.success) {
        setSuccess(response.data.message);
        setPaciente(response.data.paciente);
        setIsEditing(false);
      } else {
        setError(response.data.message || "Error al actualizar la información");
      }
    } catch (err: any) {
      console.error('Error updating paciente:', err);
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Error al actualizar la información");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 24, background: "#f8fafc", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center" }}>
      <div style={{ width: "100%", maxWidth: 900 }}>
        <button style={{
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
        }} onClick={() => onBack && onBack()}>
          <ArrowLeft size={18} /> Regresar
        </button>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>Panel de Paciente</h1>
        <p style={{ color: "#64748b", marginBottom: 24 }}>{paciente ? `Bienvenido, ${paciente.nombre_completo}` : 'Bienvenido'}</p>
        
        {/* Navegación */}
        <div style={{ display: "flex", gap: 24, borderBottom: "1px solid #e5e7eb", paddingBottom: 12, marginBottom: 24 }}>
          <button 
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.('citas')}
          >
            Mis Citas
          </button>
          <button 
            style={{ color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
            onClick={() => onNavigate?.('historial')}
          >
            Historial Médico
          </button>
          <button 
            style={{ fontWeight: 600, color: "#222", borderBottom: "2px solid #222", paddingBottom: 4, background: "none", borderTop: "none", borderLeft: "none", borderRight: "none", cursor: "pointer" }}
          >
            Mi Perfil
          </button>
        </div>

        {/* Información del paciente */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 16, alignItems: "center", marginBottom: 32 }}>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 20, minWidth: 200, flex: 1, textAlign: "center", margin: 4 }}>
            <p style={{ color: "#64748b" }}>Paciente ID</p>
            <p style={{ fontWeight: 600, fontSize: 18 }}>{paciente?.id_paciente || '—'}</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 20, minWidth: 200, flex: 1, textAlign: "center", margin: 4 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: "#334155" }}>
              <Phone size={16} />
              <p>{paciente?.telefono || '—'}</p>
            </div>
            <p style={{ color: "#64748b", marginTop: 4 }}>Teléfono</p>
          </div>
          <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 20, minWidth: 200, flex: 1, textAlign: "center", margin: 4 }}>
            <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 8, color: "#a21caf" }}>
              <Calendar size={16} />
              <p>{paciente?.edad ? `${paciente.edad} años` : '—'}</p>
            </div>
            <p style={{ color: "#64748b", marginTop: 4 }}>Edad</p>
          </div>
          <button 
            onClick={() => onNavigate?.('agendar')}
            style={{ 
              background: "#222",
              color: "#fff", 
              border: "none",
              margin: 4,
              fontWeight: 500,
              cursor: "pointer",
              boxShadow: "0 1px 4px rgba(0,0,0,0.06)",
              height: 48,
              padding: "0 32px",
              borderRadius: 10
            }}
          >
            + Nueva Cita
          </button>
        </div>

        {/* Form section */}
        <div style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 8px rgba(0,0,0,0.08)", padding: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 600, marginBottom: 8 }}>Información personal</h3>
              <p style={{ color: "#64748b", fontSize: 14 }}>
                {isEditing ? "Modifica tus datos y guarda los cambios" : "Actualiza tus datos de contacto"}
              </p>
            </div>
            {!isEditing && (
              <button 
                onClick={handleEdit}
                style={{ 
                  background: "#3b82f6", 
                  color: "#fff", 
                  borderRadius: 8, 
                  padding: "8px 20px", 
                  border: "none", 
                  fontWeight: 500, 
                  cursor: "pointer", 
                  display: "inline-flex", 
                  alignItems: "center", 
                  gap: 6,
                  fontSize: 14,
                  maxWidth: 120,
                  minWidth: 80,
                  width: "auto"
                }}
              >
                <Edit3 size={16} />
                Editar
              </button>
            )}
          </div>

          {/* Success/Error Messages */}
          {success && (
            <div style={{ 
              background: "#dcfce7", 
              color: "#166534", 
              padding: "12px 16px", 
              borderRadius: 8, 
              marginBottom: 16,
              border: "1px solid #bbf7d0"
            }}>
              {success}
            </div>
          )}
          
          {error && (
            <div style={{ 
              background: "#fef2f2", 
              color: "#dc2626", 
              padding: "12px 16px", 
              borderRadius: 8, 
              marginBottom: 16,
              border: "1px solid #fecaca"
            }}>
              {error}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 20 }}>
            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Nombre Completo</p>
              <Input 
                value={formData.nombre_completo}
                onChange={(e) => handleInputChange('nombre_completo', e.target.value)}
                disabled={!isEditing}
                style={{ 
                  background: isEditing ? "#fff" : "#f8fafc",
                  border: isEditing ? "1px solid #e5e7eb" : "1px solid #e5e7eb"
                }}
                placeholder="Ej: Juan Pérez"
              />
            </div>

            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>DUI</p>
              <Input 
                value={formData.dui}
                onChange={(e) => handleInputChange('dui', e.target.value)}
                disabled={!isEditing}
                style={{ 
                  background: isEditing ? "#fff" : "#f8fafc",
                  border: isEditing ? "1px solid #e5e7eb" : "1px solid #e5e7eb"
                }}
                placeholder="12345678-9"
              />
            </div>

            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Teléfono</p>
              <Input 
                value={formData.telefono}
                onChange={(e) => handleInputChange('telefono', e.target.value)}
                disabled={!isEditing}
                style={{ 
                  background: isEditing ? "#fff" : "#f8fafc",
                  border: isEditing ? "1px solid #e5e7eb" : "1px solid #e5e7eb"
                }}
                placeholder="70123456"
              />
            </div>

            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Correo Electrónico</p>
              <Input 
                value={formData.correo}
                onChange={(e) => handleInputChange('correo', e.target.value)}
                disabled={!isEditing}
                style={{ 
                  background: isEditing ? "#fff" : "#f8fafc",
                  border: isEditing ? "1px solid #e5e7eb" : "1px solid #e5e7eb"
                }}
                placeholder="ejemplo@correo.com"
              />
            </div>

            <div>
              <p style={{ fontSize: 12, color: "#64748b", marginBottom: 6 }}>Edad</p>
              <Input 
                type="number"
                value={formData.edad}
                onChange={(e) => handleInputChange('edad', e.target.value)}
                disabled={!isEditing}
                style={{ 
                  background: isEditing ? "#fff" : "#f8fafc",
                  border: isEditing ? "1px solid #e5e7eb" : "1px solid #e5e7eb"
                }}
                placeholder="25"
                min="0"
                max="120"
              />
            </div>
          </div>

          {/* Action buttons */}
          {isEditing && (
            <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
              <button 
                onClick={handleSave}
                disabled={loading}
                style={{ 
                  background: "#22c55e", 
                  color: "#fff", 
                  borderRadius: 8, 
                  padding: "12px 24px", 
                  border: "none", 
                  fontWeight: 500, 
                  cursor: loading ? "not-allowed" : "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  opacity: loading ? 0.7 : 1
                }}
              >
                <Save size={16} />
                {loading ? 'Guardando...' : 'Guardar Cambios'}
              </button>
              
              <button 
                onClick={handleCancel}
                disabled={loading}
                style={{ 
                  background: "#ef4444", 
                  color: "#fff", 
                  borderRadius: 8, 
                  padding: "12px 24px", 
                  border: "none", 
                  fontWeight: 500, 
                  cursor: loading ? "not-allowed" : "pointer", 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 8,
                  opacity: loading ? 0.7 : 1
                }}
              >
                <X size={16} />
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
