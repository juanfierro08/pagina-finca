import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createProperty } from '../services/firebaseMock';
import './CreateProperty.css';

export default function CreateProperty() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    pricePerNight: '',
    imageUrl: '', // Simplificado para mock
    rules: {
      pets: false,
      smoking: false,
      parties: false,
      customRules: ''
    }
  });
  const [loading, setLoading] = useState(false);

  // Redirigir si no es propietario
  if (!user || user.role !== 'Propietario') {
    return (
      <div className="container mt-xl text-center">
        <h2>Acceso denegado. Solo los propietarios pueden publicar inmuebles.</h2>
        <button onClick={() => navigate('/')} className="btn-primary mt-md">Volver al inicio</button>
      </div>
    );
  }

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
        pricePerNight: Number(formData.pricePerNight),
        images: [formData.imageUrl || 'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=1000']
      };
      
      const newProp = await createProperty(propertyData);
      
      // Redirigir al flujo de pago "SaaS"
      navigate(`/checkout/${newProp.id}`);
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
              <label>URL de la imagen (Mock)</label>
              <input 
                type="url" 
                name="imageUrl" 
                className="input-field" 
                placeholder="https://..." 
                value={formData.imageUrl} 
                onChange={handleChange} 
              />
            </div>
          </div>

          <div className="form-group mt-lg">
            <label>Reglas de la Casa</label>
            <div className="rules-grid mb-sm" style={{ display: 'flex', gap: '20px' }}>
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

          <div className="pay-to-list-banner glass-panel mt-xl">
            <h3>🌟 Suscripción Mensual (Pay-to-List)</h3>
            <p className="text-muted mt-sm">
              Para activar y mantener este anuncio visible en la plataforma, deberás suscribirte por <strong>$15.00 USD / mes</strong> en el siguiente paso.
            </p>
          </div>

          <button type="submit" className="btn-primary w-100 mt-xl create-btn" disabled={loading}>
            {loading ? 'Procesando...' : 'Guardar y Continuar al Pago'}
          </button>
        </form>
      </div>
    </div>
  );
}
