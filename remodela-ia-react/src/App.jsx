import { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthContext } from './context/AuthContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services'; 
import Login from './pages/Login';
import Chat from './pages/Chat';
import Precotizador from './pages/Precotizador'; 
import AdminDashboard from './pages/AdminDashboard'; 
import ResetPassword from './pages/ResetPassword'; 
import Contacto from './components/Contacto';
import Conocenos from './components/Conocenos'; 
import Footer from './components/Footer';
import Catalogo from './components/Catalogo';
import './App.css';

function App() {
  const { usuario, logout, cargando } = useContext(AuthContext); 
  const [vista, setVista] = useState('inicio'); 
  const location = useLocation(); 

  const renderizarContenido = () => {
    if (cargando) return <div className="loading-global">Cargando aplicación...</div>;

    // 1. Prioridad para la recuperación de contraseña
    if (location?.pathname === '/reset-password') {
      return <ResetPassword />;
    }

    // 2. Lógica de navegación por estados (Chronos Studio)
    switch(vista) {
      case 'inicio':
        return <Hero setVista={setVista} />;
      case 'servicios':
        return <Services />;
      case 'ia':
        if (!usuario) return <Login />;
        return usuario?.rol === 'admin' 
          ? <AdminDashboard /> 
          : <Chat setVista={setVista} />; 
      case 'precotizador': 
        return <Precotizador setVista={setVista} />;
      case 'catalogo':
        return <Catalogo />;
      case 'conocenos':
        return <Conocenos />;
      case 'contacto':
        return <Contacto />; 
      default:
        return <Hero setVista={setVista} />;
    }
  };

  return (
    <div className="App">
      <Navbar 
        setVista={setVista} 
        isLoggedIn={!!usuario} 
        esAdmin={usuario?.rol === 'admin'} 
        vistaActual={vista} 
        onLogout={logout} 
      />

      <main className="main-content">
        {renderizarContenido()}
      </main>

      <Footer /> 
    </div>
  );
}

export default App;