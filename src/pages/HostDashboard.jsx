import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProperties } from '../services/firebaseMock';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function HostDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [myProperties, setMyProperties] = useState([]);

  useEffect(() => {
    if (user && user.currentMode === 'Propietario') {
      getProperties().then(data => {
        setMyProperties(data.filter(p => p.hostId === user.id));
      });
    }
  }, [user]);

  if (!user || user.currentMode !== 'Propietario') {
    return <div className="container mt-xl">Acceso denegado. Cambia a Modo Anfitrión.</div>;
  }

  return (
    <div className="container dashboard-page">
      <div className="dashboard-header mb-xl">
        <h1>Panel del Propietario</h1>
        <p className="text-muted">Gestiona tus inmuebles y ganancias.</p>
      </div>

      <div className="stats-grid mb-xl">
        <div className="stat-card glass-panel">
          <h3>Ingresos del mes</h3>
          <p className="stat-value gradient-text">$1,250.00</p>
        </div>
        <div className="stat-card glass-panel">
          <h3>Reservas activas</h3>
          <p className="stat-value">3</p>
        </div>
        <div className="stat-card glass-panel">
          <h3>Inmuebles listados</h3>
          <p className="stat-value">{myProperties.length}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2>Mis Inmuebles</h2>
          <button onClick={() => navigate('/create-listing')} className="btn-primary">Añadir Inmueble</button>
        </div>
        
        <div className="properties-list">
          {myProperties.length === 0 ? (
            <p className="text-muted">Aún no tienes inmuebles listados.</p>
          ) : (
            myProperties.map(prop => (
              <div key={prop.id} className="dashboard-property-item glass-panel">
                <img src={prop.images[0]} alt={prop.title} />
                <div className="property-details-sm">
                  <h4>{prop.title}</h4>
                  <p className="text-muted">${prop.pricePerNight} / noche</p>
                </div>
                <div className="property-status">
                  <span className={`badge ${prop.status === 'activo' ? 'badge-success' : prop.status === 'en_revision' ? 'badge-warning' : prop.status === 'rechazado' ? 'badge-danger' : 'badge-warning'}`} style={{background: prop.status === 'rechazado' ? 'red' : undefined}}>
                    {prop.status === 'activo' ? 'Activo' : prop.status === 'en_revision' ? 'En Revisión (RNT)' : prop.status === 'rechazado' ? 'Rechazado (RNT Inválido)' : 'Pendiente Pago'}
                  </span>
                  {prop.boosted && <span className="badge" style={{background: '#ffd700', color: '#000', marginLeft: '5px'}}>🌟 Destacado</span>}
                  
                  {prop.status === 'pendiente' ? (
                    <button onClick={() => navigate(`/checkout/${prop.id}`)} className="btn-secondary ml-sm mt-sm" style={{padding: '4px 8px', fontSize: '0.8rem'}}>Pagar Suscripción</button>
                  ) : prop.status === 'activo' && !prop.boosted ? (
                    <button onClick={() => navigate(`/boost/${prop.id}`)} className="btn-primary ml-sm mt-sm" style={{padding: '4px 8px', fontSize: '0.8rem', background: '#ffd700', color: '#000', border: 'none'}}>🚀 Impulsar (40k COP)</button>
                  ) : null}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
