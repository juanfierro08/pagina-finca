import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProperties, MOCK_PROPERTIES } from '../services/firebaseMock';
import './Dashboard.css';

export default function AdminDashboard() {
  const { user } = useAuth();
  const [allProperties, setAllProperties] = useState([]);
  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    if (user && user.role === 'Administrador') {
      getProperties().then(data => setAllProperties(data));
    }
  }, [user, refresh]);

  if (!user || user.role !== 'Administrador') {
    return <div className="container mt-xl">Acceso denegado. Solo administradores.</div>;
  }

  const handleDelete = (id) => {
    if (window.confirm('¿Seguro que deseas eliminar este inmueble?')) {
      const index = MOCK_PROPERTIES.findIndex(p => p.id === id);
      if (index !== -1) {
        MOCK_PROPERTIES.splice(index, 1);
        setRefresh(prev => prev + 1);
      }
    }
  };

  return (
    <div className="container dashboard-page">
      <div className="dashboard-header mb-xl">
        <h1>Panel de Desarrollador / Admin</h1>
        <p className="text-muted">Gestión total de la plataforma Alojate.</p>
      </div>

      <div className="dashboard-section">
        <h2>Todos los Inmuebles</h2>
        <div className="properties-list mt-md">
          {allProperties.length === 0 ? (
            <p className="text-muted">No hay inmuebles registrados en la base de datos.</p>
          ) : (
            allProperties.map(prop => (
              <div key={prop.id} className="dashboard-property-item glass-panel">
                {prop.images && prop.images.length > 0 ? (
                   <img src={prop.images[0]} alt={prop.title} />
                ) : (
                   <div style={{width: 80, height: 80, background: '#eee'}}></div>
                )}
                <div className="property-details-sm">
                  <h4>{prop.title}</h4>
                  <p className="text-muted">{prop.location} - ${prop.pricePerNight} USD</p>
                  <p style={{fontSize: '0.8rem'}}>Host ID: {prop.hostId}</p>
                </div>
                <div className="property-status" style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px'}}>
                  <span className={`badge ${prop.status === 'activo' ? 'badge-success' : 'badge-warning'}`}>
                    {prop.status}
                  </span>
                  <button onClick={() => handleDelete(prop.id)} className="btn-secondary" style={{padding: '4px 8px', fontSize: '0.8rem', color: 'var(--color-danger)', borderColor: 'var(--color-danger)'}}>
                    Eliminar
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
