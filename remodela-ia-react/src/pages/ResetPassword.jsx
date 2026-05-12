import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import '../components/Login.css'; // Reutilizamos los estilos para mantener la estética

export default function ResetPassword() {
  const [nuevaPassword, setNuevaPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [cargando, setCargando] = useState(false);
  const navigate = useNavigate();

  const manejarCambioPassword = async (e) => {
    e.preventDefault();

    if (nuevaPassword !== confirmarPassword) {
      alert("Las contraseñas no coinciden.");
      return;
    }

    setCargando(true);
    try {
      // Supabase detecta automáticamente el token de la URL
      const { error } = await supabase.auth.updateUser({
        password: nuevaPassword
      });

      if (error) throw error;

      alert("✅ Contraseña actualizada correctamente en Remodela-IA.");
      navigate('/login'); // Redirigimos al login para que entre con su nueva clave
    } catch (error) {
      alert("Error al actualizar: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="brand-title">Arturo Rojas</h1>
          <h2 className="brand-subtitle">Nueva Contraseña</h2>
          <p>Ingresa tu nueva clave de acceso para continuar.</p>
        </div>

        <form onSubmit={manejarCambioPassword} className="login-form">
          <div className="form-group">
            <label>Nueva Contraseña</label>
            <input
              type="password"
              placeholder="Mínimo 6 caracteres"
              value={nuevaPassword}
              onChange={(e) => setNuevaPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Confirmar Contraseña</label>
            <input
              type="password"
              placeholder="Repite tu contraseña"
              value={confirmarPassword}
              onChange={(e) => setConfirmarPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? 'Actualizando...' : 'Restablecer Contraseña'}
          </button>
        </form>
      </div>
    </div>
  );
}