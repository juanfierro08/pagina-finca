import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    document: '',
    photo: ''
  });
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isRegister) {
      login(formData);
    } else {
      // Mock login check
      login({ name: formData.email.split('@')[0], email: formData.email, phone: '', document: '', photo: '' });
    }
    navigate('/');
  };

  return (
    <div className="container login-page">
      <div className="login-card glass-panel">
        <h2 className="login-title">{isRegister ? 'Crear Cuenta en Alojate' : 'Bienvenido de nuevo'}</h2>
        <p className="login-subtitle">
          {isRegister ? 'Únete a la mejor comunidad de rentas vacacionales' : 'Ingresa para continuar'}
        </p>
        
        <form onSubmit={handleSubmit} className="login-form">
          {isRegister && (
            <>
              <input type="text" name="name" placeholder="Nombre completo" className="input-field mb-sm" onChange={handleChange} required />
              <input type="tel" name="phone" placeholder="Teléfono" className="input-field mb-sm" onChange={handleChange} required />
              <input type="text" name="document" placeholder="Documento de Identidad" className="input-field mb-sm" onChange={handleChange} required />
              <input type="url" name="photo" placeholder="URL Foto de Perfil (Opcional)" className="input-field mb-sm" onChange={handleChange} />
            </>
          )}

          <input type="email" name="email" placeholder="Correo electrónico" className="input-field mb-sm" onChange={handleChange} required />
          <input type="password" name="password" placeholder="Contraseña" className="input-field mb-sm" onChange={handleChange} required />
          
          <button type="submit" className="btn-primary w-100 mt-sm">
            {isRegister ? 'Registrarse' : 'Ingresar'}
          </button>
        </form>

        <p className="text-center mt-md text-muted" style={{cursor: 'pointer'}} onClick={() => setIsRegister(!isRegister)}>
          {isRegister ? '¿Ya tienes cuenta? Ingresa aquí' : '¿No tienes cuenta? Regístrate'}
        </p>
      </div>
    </div>
  );
}
