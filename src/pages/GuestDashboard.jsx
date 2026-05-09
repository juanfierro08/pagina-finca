import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

export default function GuestDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user || user.role !== 'Huesped') {
    return <div className="container mt-xl">Acceso denegado.</div>;
  }

  return (
    <div className="container dashboard-page">
      <div className="dashboard-header mb-xl">
        <h1>Mi Perfil (Huésped)</h1>
        <p className="text-muted">Revisa tus reservas pasadas y próximas escapadas.</p>
      </div>

      <div className="dashboard-section">
        <h2>Próximos Viajes</h2>
        <div className="properties-list mt-md">
          {/* Mock data for reservations */}
          <div className="dashboard-property-item glass-panel">
            <img src="https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=200" alt="Villa Moderna" />
            <div className="property-details-sm">
              <h4>Villa Moderna con Piscina Infinita</h4>
              <p className="text-muted">12 de Octubre - 15 de Octubre</p>
            </div>
            <div className="property-status">
              <span className="badge badge-success">Confirmada</span>
              <button onClick={() => navigate('/messages')} className="btn-secondary ml-sm" style={{padding: '4px 8px', fontSize: '0.8rem'}}>Contactar Anfitrión</button>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-section mt-xl">
        <h2>Historial de Viajes (Reseñas pendientes)</h2>
        <div className="properties-list mt-md">
          <div className="dashboard-property-item glass-panel" style={{ opacity: 0.8 }}>
            <img src="https://images.unsplash.com/photo-1502672260266-1c1de2d96674?auto=format&fit=crop&q=80&w=200" alt="Loft Urbano" />
            <div className="property-details-sm">
              <h4>Loft Urbano Minimalista</h4>
              <p className="text-muted">1 de Septiembre - 3 de Septiembre</p>
            </div>
            <div className="property-status" style={{display: 'flex', alignItems: 'center', gap: '10px'}}>
              <span className="badge" style={{background: '#e9ecef', color: '#6c757d'}}>Completada</span>
              <button className="btn-primary" style={{padding: '4px 8px', fontSize: '0.8rem'}}>Dejar Reseña</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
