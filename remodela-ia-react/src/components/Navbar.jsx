import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext'; // Importación vital
import './Navbar.css';

export default function Navbar({ setVista, vistaActual }) {
  // 1. Obtenemos usuario y logout directamente del contexto global
  const { usuario, logout } = useContext(AuthContext);

  const manejarLogout = () => {
    logout(); // Limpia el contexto y localStorage
    setVista('inicio'); // Redirige al inicio
  };

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => setVista('inicio')}>
        Arturo Rojas
      </div>
      
      <ul className="nav-links">
        <li 
          className={vistaActual === 'inicio' ? 'active-link' : ''} 
          onClick={() => setVista('inicio')}
        >Inicio</li>

        <li 
          className={vistaActual === 'catalogo' ? 'active-link' : ''} 
          onClick={() => setVista('catalogo')}
        >Catálogo</li>

        <li 
          className={vistaActual === 'servicios' ? 'active-link' : ''} 
          onClick={() => setVista('servicios')}
        >Servicios</li>
        
        <li 
          className={vistaActual === 'conocenos' ? 'active-link' : ''} 
          onClick={() => setVista('conocenos')}
        >Testimonios</li>

        <li 
          className={vistaActual === 'ia' ? 'active-link' : ''} 
          onClick={() => setVista('ia')}
        >
          {/* Cambiamos el texto si ya está logueado */}
          {usuario ? '✨ Mi Asesoría' : 'Asesoría IA'}
        </li>
        
        <li 
          className={vistaActual === 'contacto' ? 'active-link' : ''} 
          onClick={() => setVista('contacto')}
        >Contacto</li>
      </ul>

      <div className="nav-actions">
        {/* 2. Lógica dinámica: Si hay usuario, mostramos su nombre y botón Salir */}
        {usuario ? (
          <div className="user-nav-container">
            <span className="user-name-nav">Hola, <strong>{usuario.nombre}</strong></span>
            <button className="btn-salir-nav" onClick={manejarLogout}>
              Salir
            </button>
          </div>
        ) : (
          <button className="btn-whatsapp" onClick={() => window.location.href = 'tel:+573001234567'}>
            WhatsApp
          </button>
        )}
      </div>
    </nav>
  );
}