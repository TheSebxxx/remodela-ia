import { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient'; 
import '../components/Login.css';

export default function Login() {
  const { login } = useContext(AuthContext);
  const [vista, setVista] = useState('login'); 
  const [cargando, setCargando] = useState(false);
  
  const [formData, setFormData] = useState({ 
    nombre_completo: '', 
    email: '', 
    password: '',
    telefono: '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const manejarOlvidoPassword = async (e) => {
    e.preventDefault();
    setCargando(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.email, {
        redirectTo: 'http://localhost:5173/reset-password',
      });
      if (error) throw error;
      alert("📧 ¡Enlace enviado! Revisa tu correo electrónico.");
      setVista('login');
    } catch (error) {
      alert("Error: " + error.message);
    } finally {
      setCargando(false);
    }
  };

  const manejarEnvio = async (e) => {
    e.preventDefault();
    if (vista === 'recuperar') return manejarOlvidoPassword(e);
    
    setCargando(true);

    try {
      if (vista === 'registro') {
        // --- LÓGICA DE REGISTRO DIRECTO CON SUPABASE ---
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
          options: {
            data: {
              nombre_completo: formData.nombre_completo,
              telefono: formData.telefono,
              rol: 'cliente' // Por defecto siempre es cliente al registrarse solo
            }
          }
        });

        if (authError) throw authError;

        if (authData.user) {
          // Forzamos la creación en la tabla 'perfiles' igual que en el Admin
          const { error: profileError } = await supabase
            .from('perfiles')
            .insert([
              { 
                id: authData.user.id, 
                email: formData.email, 
                nombre_completo: formData.nombre_completo, 
                telefono: formData.telefono, 
                rol: 'cliente' 
              }
            ]);

          if (profileError) throw profileError;

          alert("✅ ¡Registro exitoso! Ya puedes iniciar sesión.");
          setVista('login');
        }
      } else {
        // --- LÓGICA DE LOGIN DIRECTO CON SUPABASE ---
        const { data, error: loginError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (loginError) throw loginError;

        // Buscamos el perfil para obtener el nombre y el rol
        const { data: perfil, error: perfilError } = await supabase
          .from('perfiles')
          .select('nombre_completo, rol')
          .eq('id', data.user.id)
          .single();

        if (perfilError) throw perfilError;

        // Usamos la función del contexto para guardar la sesión
        login(data.user.id, perfil.nombre_completo, perfil.rol);
      }
    } catch (error) {
      alert("Error: " + (error.message || "Algo salió mal"));
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1 className="brand-title">Arturo Rojas</h1>
          <h2 className="brand-subtitle">Remodela-IA</h2>
          <p>
            {vista === 'registro' && 'Crea tu cuenta'}
            {vista === 'login' && 'Bienvenido de nuevo'}
            {vista === 'recuperar' && 'Recuperar acceso'}
          </p>
        </div>
        
        <form onSubmit={manejarEnvio} className="login-form">
          {vista === 'registro' && (
            <>
              <div className="form-group">
                <label>Nombre Completo</label>
                <input type="text" name="nombre_completo" value={formData.nombre_completo} required onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Teléfono</label>
                <input type="text" name="telefono" value={formData.telefono} required onChange={handleChange} />
              </div>
            </>
          )}

          <div className="form-group">
            <label>Correo electrónico</label>
            <input type="email" name="email" value={formData.email} placeholder="tu@email.com" required onChange={handleChange} />
          </div>

          {vista !== 'recuperar' && (
            <div className="form-group">
              <label>Contraseña</label>
              <input type="password" name="password" value={formData.password} required onChange={handleChange} />
              {vista === 'login' && (
                <span className="forgot-password-link" onClick={() => setVista('recuperar')}>
                  ¿Olvidaste tu contraseña?
                </span>
              )}
            </div>
          )}

          <button type="submit" className="btn-login" disabled={cargando}>
            {cargando ? 'Procesando...' : (
              vista === 'registro' ? 'Registrarse Ahora' : 
              vista === 'login' ? 'Ingresar' : 'Enviar Enlace'
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>
            {vista === 'login' ? (
              <>¿Aún no tienes cuenta? <span className="toggle-auth" onClick={() => setVista('registro')}>Regístrate aquí</span></>
            ) : (
              <span className="toggle-auth" onClick={() => setVista('login')}>Volver al inicio de sesión</span>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}