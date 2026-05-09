import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { boostProperty } from '../services/firebaseMock';
import { PayPalButtons } from "@paypal/react-paypal-js";
import './Checkout.css';

export default function BoostCheckout() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      try {
        setLoading(true);
        // Impulsar la propiedad
        await boostProperty(id);
        navigate('/success');
      } catch (error) {
        console.error(error);
        alert('Error al impulsar el inmueble.');
      } finally {
        setLoading(false);
      }
    });
  };

  return (
    <div className="container checkout-page">
      <div className="checkout-card glass-panel">
        <div className="checkout-header">
          <h2>Impulsar Anuncio 🚀</h2>
          <p className="text-muted">Destaca tu inmueble para aparecer en los primeros resultados de búsqueda.</p>
        </div>

        <div className="payment-summary mt-lg">
          <div className="summary-row">
            <span>Suscripción de Impulso (Mensual)</span>
            <span>$40,000 COP (~$10.00 USD)</span>
          </div>
          <hr className="divider" />
          <div className="summary-row total">
            <span>Total a pagar hoy</span>
            <span>$10.00 USD</span>
          </div>
        </div>

        <div className="payment-form mt-xl">
          {loading ? (
            <p className="text-center">Impulsando tu inmueble...</p>
          ) : (
            <PayPalButtons 
              style={{ layout: "vertical" }}
              createOrder={(data, actions) => {
                return actions.order.create({
                  purchase_units: [
                    {
                      description: "Impulso mensual de inmueble (40,000 COP)",
                      amount: {
                        value: "10.00"
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
          🔒 Pagos seguros procesados por PayPal. El cobro se procesará en USD.
        </p>
      </div>
    </div>
  );
}
