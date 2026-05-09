import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProperty, activateProperty } from '../services/firebaseMock';
import './CreateProperty.css';

export default function CreateProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    rnt: '',
    pricePerNight: '',
    images: [], 
    rules: {
      pets: false,
      smoking: false,
      parties: false,
      customRules: ''
    }
  });
  const [loading, setLoading] = useState(false);

  // Redirigir si no está en modo propietario
  if (!user || user.currentMode !== 'Propietario') {
    return (
      <div className="container mt-xl text-center">
        <h2>Acceso denegado. Solo los propietarios pueden publicar inmuebles.</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-md">Volver al inicio</button>
      </div>
    );
  }

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    const promises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.readAsDataURL(file);
      });
    });
    Promise.all(promises).then(base64Images => {
      setFormData({ ...formData, images: base64Images });
    });
  };

  const handleRntFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        alert('Por favor, sube un archivo PDF válido para el RNT.');
        e.target.value = null;
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, rnt: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    if (e.target.type === 'checkbox') {
      setFormData({
        ...formData,
        rules: { ...formData.rules, [e.target.name]: e.target.checked }
      });
    } else if (e.target.name === 'customRules') {
      setFormData({
        ...formData,
        rules: { ...formData.rules, customRules: e.target.value }
      });
    } else {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simular guardado en "Firestore"
      const propertyData = {
        ...formData,
        hostId: user.id,
        hostEmail: user.email,
        pricePerNight: Number(formData.pricePerNight),
        images: formData.images.length > 0 ? formData.images : ['https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000']
      };
      
      const newProp = await createProperty(propertyData);
      
      // TEMPORAL: Omitimos el pago para hacer pruebas
      await activateProperty(newProp.id);
      
      // Redirigir al dashboard directamente
      navigate('/host-dashboard');
    } catch (error) {
      console.error(error);
      alert('Error al publicar');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container create-page">
      <div className="create-header">
        <h1>Publica tu inmueble</h1>
        <p className="text-muted">Comparte tu espacio y comienza a ganar ingresos</p>
      </div>

      <div className="create-content">
        <form className="glass-panel create-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Título del Inmueble</label>
            <input 
              type="text" 
              name="title" 
              className="input-field" 
              placeholder="Ej. Cabaña frente al lago" 
              value={formData.title} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group mt-md">
            <label>Ubicación (Ciudad, País)</label>
            <input 
              type="text" 
              name="location" 
              className="input-field" 
              placeholder="Ej. Medellín, Colombia" 
              value={formData.location} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-group mt-md">
            <label>Registro Nacional de Turismo (RNT) - Sube el PDF</label>
            <input 
              type="file" 
              name="rnt" 
              accept=".pdf,application/pdf"
              className="input-field" 
              onChange={handleRntFileChange} 
              required 
            />
            {formData.rnt && <p className="text-muted mt-sm" style={{fontSize: '0.8rem', color: 'var(--color-secondary)'}}>✅ PDF del RNT cargado correctamente</p>}
            <small className="text-muted">Obligatorio. Sube el documento oficial en PDF. Será verificado por administración antes de publicarse.</small>
          </div>

          <div className="form-group">
            <label>Descripción detallada</label>
            <textarea 
              name="description" 
              className="input-field textarea" 
              placeholder="Describe las comodidades, la ubicación, etc." 
              rows="5"
              value={formData.description} 
              onChange={handleChange} 
              required 
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Precio por noche (USD)</label>
              <input 
                type="number" 
                name="pricePerNight" 
                className="input-field" 
                placeholder="0.00" 
                min="1"
                value={formData.pricePerNight} 
                onChange={handleChange} 
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Fotos del Inmueble (Sube desde tu galería)</label>
              <input 
                type="file" 
                multiple
                accept="image/*"
                className="input-field" 
                onChange={handleFileChange} 
                required 
              />
              {formData.images.length > 0 && (
                <p className="text-muted mt-sm" style={{fontSize: '0.8rem'}}>✅ {formData.images.length} foto(s) seleccionadas</p>
              )}
            </div>
          </div>

          <div className="form-group mt-lg">
            <label>Reglas de la Casa</label>
            <div className="rules-grid mb-sm" style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="pets" checked={formData.rules.pets} onChange={handleChange} /> Admite Mascotas
              </label>
              <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="smoking" checked={formData.rules.smoking} onChange={handleChange} /> Se permite fumar
              </label>
              <label style={{ fontWeight: 'normal', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <input type="checkbox" name="parties" checked={formData.rules.parties} onChange={handleChange} /> Se permiten fiestas
              </label>
            </div>
            <textarea 
              name="customRules" 
              className="input-field textarea" 
              style={{ minHeight: '80px' }}
              placeholder="Ej. Horario de silencio de 10 PM a 8 AM, dejar la basura en el contenedor..." 
              value={formData.rules.customRules} 
              onChange={handleChange} 
            />
          </div>

          {/* TEMPORAL: Oculto para pruebas
          <div className="pay-to-list-banner glass-panel mt-xl">
            <h3>🌟 Suscripción Mensual (Pay-to-List)</h3>
            <p className="text-muted mt-sm">
              Para activar y mantener este anuncio visible en la plataforma, deberás suscribirte por <strong>$15.00 USD / mes</strong> en el siguiente paso.
            </p>
          </div>
          */}

          <button type="submit" className="btn-primary w-100 mt-xl create-btn" disabled={loading}>
            {loading ? 'Procesando...' : 'Publicar y Enviar a Revisión (Prueba sin pago)'}
          </button>
        </form>
      </div>
    </div>
  );
}
