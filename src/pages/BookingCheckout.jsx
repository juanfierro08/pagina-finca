import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../services/firebaseMock';
import { useAuth } from '../context/AuthContext';
import { PayPalButtons } from "@paypal/react-paypal-js";
import './Checkout.css';

export default function BookingCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Extract booking info from location state (passed from PropertyDetails)
  const bookingInfo = location.state || { guests: 1, total: 0, days: 1 };
  
  const property = MOCK_PROPERTIES.find(p => p.id === id);

  if (!user || user.role !== 'Huesped') {
    return <div className="container mt-xl">Acceso denegado. Solo huéspedes pueden reservar.</div>;
  }

  const totalToPay = (bookingInfo.total || 0) + 40;

  const handleApprove = (data, actions) => {
    return actions.order.capture().then((details) => {
      // alert('Transaction completed by ' + details.payer.name.given_name);
      
      // Simulate auto-message to the host
      alert(`¡Pago completado! Has reservado ${property.title}.\nSe ha enviado un mensaje automático al anfitrión.`);
      
      navigate('/success');
    });
  };

  if (!property) return <div className="container">Inmueble no encontrado</div>;

  return (
    <div className="container checkout-page">
      <div className="checkout-card glass-panel">
        <div className="checkout-header">
          <h2>Pagar Reserva</h2>
          <p className="text-muted">Asegura tu estancia en {property.title}</p>
        </div>

        <div className="payment-summary mt-lg">
          <div className="summary-row">
            <span>{bookingInfo.days} Noches</span>
            <span>${property.pricePerNight * bookingInfo.days} USD</span>
          </div>
          <div className="summary-row">
            <span>Huéspedes</span>
            <span>{bookingInfo.guests}</span>
          </div>
          <div className="summary-row">
            <span>Tarifa de limpieza</span>
            <span>$40.00 USD</span>
          </div>
          <hr className="divider" />
          <div className="summary-row total">
            <span>Total a pagar ahora</span>
            <span>${totalToPay.toFixed(2)} USD</span>
          </div>
        </div>

        <div className="payment-form mt-xl">
          <PayPalButtons 
            style={{ layout: "vertical" }}
            createOrder={(data, actions) => {
              return actions.order.create({
                purchase_units: [
                  {
                    description: `Reserva de ${property.title}`,
                    amount: {
                      value: totalToPay.toFixed(2)
                    }
                  }
                ]
              });
            }}
            onApprove={handleApprove}
            onError={(err) => {
              console.error("PayPal Checkout onError", err);
              alert("Ocurrió un error con el pago de PayPal.");
            }}
          />
        </div>

        <p className="text-center text-muted mt-sm" style={{ fontSize: '0.8rem' }}>
          🔒 Pagos seguros procesados por PayPal.
        </p>
      </div>
    </div>
  );
}
