import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProperties } from '../services/firebaseMock';
import { useCurrency } from '../context/CurrencyContext';
import './Home.css';

export default function Home() {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProperties().then(data => {
      // Solo mostrar propiedades activas
        const activeProps = data.filter(p => p.status === 'activo');
        // Sort boosted properties first
        activeProps.sort((a, b) => (b.boosted ? 1 : 0) - (a.boosted ? 1 : 0));
        setProperties(activeProps);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="container" style={{ textAlign: 'center', marginTop: '20vh' }}>
        <h2>Cargando inmuebles...</h2>
      </div>
    );
  }

  return (
    <div className="container home-page">
      <header className="hero">
        <h1 className="hero-title">Encuentra tu próximo <span className="gradient-text">destino de lujo</span></h1>
        <p className="hero-subtitle">Descubre espacios únicos para escapadas inolvidables.</p>
      </header>

      <div className="properties-grid">
        {properties.map(property => (
          <div key={property.id} className="property-card glass-panel">
            <div className="property-image-wrapper">
              <img src={property.images[0]} alt={property.title} className="property-image" />
              <div className="price-badge">{formatPrice(property.pricePerNight)} <small>/ noche</small></div>
            </div>
            <div className="property-info" style={{position: 'relative'}}>
              {property.boosted && (
                <div style={{position: 'absolute', top: '-40px', right: '10px', background: '#ffd700', color: '#000', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', boxShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>
                  🌟 Destacado
                </div>
              )}
              <h3 className="property-title">{property.title}</h3>
              {property.location && <p className="text-muted" style={{fontSize: '0.9rem', marginBottom: '4px'}}>📍 {property.location}</p>}
              <p className="property-desc">{property.description.substring(0, 80)}...</p>
              <button onClick={() => navigate(`/property/${property.id}`)} className="btn-primary w-100 mt-sm">Ver disponibilidad</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
