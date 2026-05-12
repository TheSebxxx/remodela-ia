import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import './SidebarProfile.css';

export default function SidebarProfile() {
  const [perfil, setPerfil] = useState({ nombre: 'Cargando...', iniciales: '--' });

  // Función para obtener los datos desde la tabla 'perfiles'
  const cargarDatosPerfil = async (userId) => {
    try {
      const { data, error: _error } = await supabase
        .from('perfiles')
        .select('nombre_completo')
        .eq('id', userId)
        .single();

      if (data && data.nombre_completo) {
        const nombre = data.nombre_completo;
        const iniciales = nombre
          .split(' ')
          .filter(n => n !== "")
          .map(n => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2);
        
        setPerfil({ nombre, iniciales });
      } else {
        // Fallback si no hay nombre en la tabla: usar el email del usuario
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const emailNombre = user.email.split('@')[0];
          setPerfil({ 
            nombre: emailNombre.charAt(0).toUpperCase() + emailNombre.slice(1), 
            iniciales: emailNombre.slice(0, 2).toUpperCase() 
          });
        }
      }
    } catch  {
      setPerfil({ nombre: 'Error de Perfil', iniciales: '!!' });
    }
  };

  useEffect(() => {
    // Escuchar cambios en la autenticación (la variable que define si está activo)
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        cargarDatosPerfil(session.user.id);
      } else {
        setPerfil({ nombre: 'Acceso Admin', iniciales: 'IA' });
      }
    });

    // Verificación inicial al montar el componente
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) cargarDatosPerfil(session.user.id);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <div className="admin-profile">
      <div className="avatar">{perfil.iniciales}</div>
      <div className="profile-info">
        <p className="name">{perfil.nombre}</p>
        <p className="status">En línea</p>
      </div>
    </div>
  );
}