import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, toggleMode } = useAuth();
  const { currency, setCurrency } = useCurrency();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="container navbar-container">
        <Link to="/" className="navbar-brand">
          <img src="/logo.png" alt="Alojate Logo" className="navbar-logo" />
          <span className="gradient-text">Alojate</span>
        </Link>
        
        <div className="navbar-links">
          {/* Currency selector Mock */}
          <select className="currency-selector" value={currency} onChange={e => setCurrency(e.target.value)}>
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="COP">COP ($)</option>
            <option value="MXN">MXN ($)</option>
          </select>

          {user ? (
            <>
              {user.role !== 'Administrador' && (
                <button onClick={toggleMode} className="btn-secondary" style={{fontSize: '0.85rem', padding: '6px 12px', marginRight: '10px'}}>
                  {user.currentMode === 'Huesped' ? 'Modo Anfitrión' : 'Modo Huésped'}
                </button>
              )}
              <Link to={user.role === 'Administrador' ? '/admin-dashboard' : user.currentMode === 'Propietario' ? '/host-dashboard' : '/guest-dashboard'} className="user-greeting">
                <span className="user-avatar-small">
                  {user.photo ? <img src={user.photo} alt="Avatar" /> : user.name.charAt(0)}
                </span>
                Hola, {user.name}
              </Link>
              
              {user.currentMode === 'Propietario' && (
                <Link to="/create-listing" className="btn-secondary publish-btn">Publicar Inmueble</Link>
              )}
              <Link to="/messages" className="nav-link">Mensajes</Link>
              <button onClick={handleLogout} className="btn-secondary logout-btn">Salir</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Ingresar</Link>
              <Link to="/login" className="btn-primary">Registrarse</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
