import { useNavigate } from 'react-router-dom';

export default function Success() {
  const navigate = useNavigate();

  return (
    <div className="container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', textAlign: 'center' }}>
      <div className="glass-panel" style={{ padding: '3rem', maxWidth: '500px' }}>
        <div style={{ fontSize: '4rem', color: 'var(--color-success)', marginBottom: '1rem' }}>✓</div>
        <h1 style={{ color: 'var(--color-primary)', marginBottom: '1rem' }}>¡Pago Completado!</h1>
        <p className="text-muted" style={{ marginBottom: '2rem' }}>
          La transacción se ha procesado correctamente a través de PayPal y tu reserva o activación ha sido confirmada.
        </p>
        <button className="btn-primary" onClick={() => navigate('/')}>
          Volver al Inicio
        </button>
      </div>
    </div>
  );
}
