import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { useAuth } from '../context/AuthContext';
import { useCurrency } from '../context/CurrencyContext';
import { MOCK_PROPERTIES } from '../services/firebaseMock';
import ReviewSection from '../components/ReviewSection';
import './PropertyDetails.css';

export default function PropertyDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { formatPrice } = useCurrency();
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [dates, setDates] = useState([new Date(), new Date()]);
  const [adults, setAdults] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [rulesAccepted, setRulesAccepted] = useState(false);

  useEffect(() => {
    // Simulamos la carga desde la base de datos
    const prop = MOCK_PROPERTIES.find(p => p.id === id);
    if (prop) {
      setProperty(prop);
    }
  }, [id]);

  const handleReserve = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (!rulesAccepted) {
      alert('Debes aceptar las reglas de la casa para continuar.');
      return;
    }
    
    navigate(`/book/${property.id}`, { 
      state: { 
        guests: adults + childrenCount, 
        days, 
        total: totalPrice 
      } 
    });
  };

  const handleContactHost = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate('/messages');
  };

  if (!property) return <div className="container mt-xl">Cargando detalles...</div>;

  const days = Math.ceil(Math.abs(dates[1] - dates[0]) / (1000 * 60 * 60 * 24)) || 1;
  const totalPrice = days * property.pricePerNight;

  return (
    <div className="container property-details">
      <h1 className="property-title-lg">{property.title}</h1>
      {property.location && <p className="text-muted" style={{fontSize: '1.2rem', marginBottom: '1rem'}}>📍 Ubicación: {property.location}</p>}
      
      <div className="property-gallery">
        <img src={property.images[0]} alt={property.title} className="gallery-main-img" />
      </div>

      <div className="property-content-grid">
        <div className="property-description glass-panel">
          <h2>Acerca de este espacio</h2>
          <p>{property.description}</p>
          
          <h3 className="mt-xl mb-sm">Reglas de la Casa</h3>
          <ul style={{ listStyleType: 'disc', paddingLeft: '20px', marginBottom: '1rem', color: 'var(--color-text-muted)' }}>
            <li>Mascotas: {property.rules?.pets ? 'Permitidas' : 'No permitidas'}</li>
            <li>Fumar: {property.rules?.smoking ? 'Permitido' : 'No permitido'}</li>
            <li>Fiestas: {property.rules?.parties ? 'Permitidas' : 'No permitidas'}</li>
            {property.rules?.customRules && <li>Adicional: {property.rules.customRules}</li>}
          </ul>
          
          <h3 className="mt-xl mb-sm">Disponibilidad</h3>
          <div className="calendar-wrapper">
            <Calendar 
              onChange={setDates} 
              value={dates} 
              selectRange={true} 
              minDate={new Date()}
            />
          </div>
        </div>

        <div className="property-sidebar">
          <div className="booking-card glass-panel">
            <div className="booking-price">
              <h2>{formatPrice(property.pricePerNight)} <small>/ noche</small></h2>
            </div>
            
            <div className="booking-summary mt-md">
              <div className="summary-row">
                <span>{formatPrice(property.pricePerNight)} x {days} noches</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="summary-row">
                <span>Huéspedes</span>
                <span>{adults + childrenCount}</span>
              </div>
              <div className="summary-row">
                <span>Tarifa de servicio</span>
                <span>{formatPrice(Math.round(totalPrice * 0.1))}</span>
              </div>
              <hr className="divider" />
              <div className="summary-row total">
                <span>Total</span>
                <span>{formatPrice(totalPrice + Math.round(totalPrice * 0.1))}</span>
              </div>
            </div>

            <div className="guests-selector mt-md mb-md" style={{ display: 'flex', gap: '10px' }}>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Adultos</label>
                <input type="number" min="1" className="input-field" value={adults} onChange={e => setAdults(Number(e.target.value))} />
              </div>
              <div style={{ flex: 1 }}>
                <label style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>Niños</label>
                <input type="number" min="0" className="input-field" value={childrenCount} onChange={e => setChildrenCount(Number(e.target.value))} />
              </div>
            </div>

            <div className="rules-acceptance mb-md">
              <label style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}>
                <input type="checkbox" checked={rulesAccepted} onChange={e => setRulesAccepted(e.target.checked)} />
                He leído y acepto las reglas de la casa
              </label>
            </div>

            <button onClick={handleReserve} className="btn-primary w-100 booking-btn">
              Reservar ahora
            </button>
            <p className="text-center text-muted mt-sm"><small>Pagarás el 100% en el siguiente paso</small></p>

            <hr className="divider" />
            <button onClick={handleContactHost} className="btn-secondary w-100">
              Contactar al anfitrión
            </button>
          </div>
        </div>
      </div>

      <ReviewSection propertyId={property.id} />
    </div>
  );
}
