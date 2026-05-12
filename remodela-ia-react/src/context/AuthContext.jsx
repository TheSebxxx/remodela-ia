import { createContext, useState, useEffect, useMemo } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);

  // 1. Revisar sesión persistente al cargar la app
  useEffect(() => {
    const revisarSesion = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          const { data: perfil } = await supabase
            .from('perfiles')
            .select('nombre_completo, rol') 
            .eq('id', session.user.id)
            .single();

          setUsuario({
            id: session.user.id,
            email: session.user.email,
            nombre: perfil?.nombre_completo || 'Usuario',
            rol: perfil?.rol || 'cliente' // Recupera el rol real de la DB
          });
        }
      } catch (error) {
        console.error("Error al recuperar sesión:", error);
      } finally {
        setCargando(false);
      }
    };

    revisarSesion();

    // 2. Escuchar cambios de estado (Login/Logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        revisarSesion();
      } else {
        setUsuario(null);
        setCargando(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  /**
   * FUNCIÓN LOGIN CORREGIDA
   * Ahora recibe el rol desde el componente Login.jsx
   */
  const login = (usuarioId, nombre_completo, rol) => {
    setUsuario({
      id: usuarioId,
      nombre: nombre_completo || 'Usuario',
      rol: rol || 'cliente' // 👈 Recibe el rol dinámico del backend
    });
  };

  const logout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    setUsuario(null);
    window.location.href = "/";
  };

  const value = useMemo(() => ({
    usuario, 
    login, 
    logout, 
    cargando
  }), [usuario, cargando]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };