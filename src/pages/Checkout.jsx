import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { activateProperty } from '../services/firebaseMock';
import { PayPalButtons } from "@paypal/react-paypal-js";
import './Checkout.css';

export default function Checkout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        setLoading(true);
        // Activar la propiedad
        await activateProperty(id);
        navigate('/success');
      } catch (error) {
        console.error(error);
        alert('Error al activar el inmueble.');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="container checkout-page">
      <div className="checkout-card glass-panel">
        <div className="checkout-header">
          <h2>Activa tu anuncio</h2>
          <p className="text-muted">Inicia tu suscripción mensual para publicar tu inmueble en Alojate.</p>
        </div>

        <div className="payment-summary mt-lg">
          <div className="summary-row">
            <span>Suscripción Mensual (Pay-to-List)</span>
            <span>$15.00 USD / mes</span>
          </div>
          <hr className="divider" />
          <div className="summary-row total">
            <span>Total a pagar hoy</span>
            <span>$15.00 USD</span>
          </div>
        </div>

        <div className="payment-form mt-xl">
          {loading ? (
            <p className="text-center">Activando tu inmueble...</p>
          ) : (
            <PayPalButtons 
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      description: "Activación mensual de inmueble (Alojate)",
                      amount: {
                        value: "15.00"
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
          )}
        </div>

        <p className="text-center text-muted mt-sm" style={{ fontSize: '0.8rem' }}>
          🔒 Pagos seguros procesados por PayPal.
        </p>
      </div>
    </div>
  );
}
