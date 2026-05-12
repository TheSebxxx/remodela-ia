import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabaseClient';
import UserForm from './UserForm';
import './UserManagement.css';

export default function UserManagement({ onRefresh }) {
  const [usuarios, setUsuarios] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioAEditar, setUsuarioAEditar] = useState(null);

  const obtenerUsuarios = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('perfiles')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      setUsuarios(data || []);
    } catch (error) {
      console.error("Error al obtener perfiles:", error.message);
    }
  }, []);

  const manejarGuardarUsuario = async (datos) => {
    const { id, nombre_completo, telefono, rol, email, password } = datos;
    
    if (id) {
      // --- LÓGICA DE ACTUALIZACIÓN ---
      const { error } = await supabase
        .from('perfiles')
        .update({ nombre_completo, telefono, rol })
        .eq('id', id);

      if (!error) {
        setMostrarModal(false);
        setUsuarioAEditar(null);
        await obtenerUsuarios();
        if (onRefresh) onRefresh();
      } else {
        alert("Error al actualizar: " + error.message);
      }
    } else {
      // --- LÓGICA DE CREACIÓN ---
      // 1. Registro en Authentication
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nombre_completo, telefono, rol }
        }
      });

      if (authError) {
        // Si sale "User already registered", recuerda borrarlo en el dashboard de Supabase
        alert("Error en Auth: " + authError.message);
        return;
      }

      if (authData.user) {
        // 2. Inserción Manual en tabla 'perfiles' 
        // Esto asegura que aparezca en la lista inmediatamente sin depender del trigger
        const { error: profileError } = await supabase
          .from('perfiles')
          .insert([
            { 
              id: authData.user.id, 
              email, 
              nombre_completo, 
              telefono, 
              rol 
            }
          ]);

        if (profileError) {
          console.error("Error al crear perfil:", profileError.message);
          alert("Cuenta creada, pero hubo un error al crear el perfil en la tabla.");
        } else {
          alert("¡Usuario creado con éxito!");
          setMostrarModal(false);
          await obtenerUsuarios(); // Recarga la tabla local
          if (onRefresh) onRefresh(); // Recarga métricas globales
        }
      }
    }
  };

  const eliminarUsuario = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este usuario? Esto solo lo quita de la tabla perfiles.")) {
      const { error } = await supabase.from('perfiles').delete().eq('id', id);
      if (!error) {
        obtenerUsuarios();
        if (onRefresh) onRefresh();
      } else {
        alert("Error al eliminar: " + error.message);
      }
    }
  };

  useEffect(() => {
    obtenerUsuarios();
  }, [obtenerUsuarios]);

  return (
    <div className="view-fade">
      <header className="content-header">
        <div className="header-info">
          <h1 className='titulo'>Usuarios Registrados</h1>
          <p>Gestión de accesos para <strong>Remodela-IA</strong></p>
        </div>
        <div className="header-actions">
          <button className="btn-add" onClick={() => { setUsuarioAEditar(null); setMostrarModal(true); }}>
            +
          </button>
        </div>
      </header>
      
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.length > 0 ? (
              usuarios.map(u => (
                <tr key={u.id}>
                  <td><strong>{u.nombre_completo || 'Sin nombre'}</strong></td>
                  <td>{u.email}</td>
                  <td>{u.telefono || 'N/A'}</td>
                  <td>
                    <span className={`rol-tag ${u.rol}`}>
                      {u.rol === 'admin' ? '🛡️ Admin' : '👤 Cliente'}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button 
                      className="btn-edit" 
                      onClick={() => { setUsuarioAEditar(u); setMostrarModal(true); }}
                    >
                      Editar
                    </button>
                    <button 
                      className="btn-delete" 
                      onClick={() => eliminarUsuario(u.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{textAlign: 'center', padding: '20px'}}>
                  No hay usuarios para mostrar.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <UserForm 
          usuarioEditando={usuarioAEditar}
          alCerrar={() => { setMostrarModal(false); setUsuarioAEditar(null); }}
          alGuardar={manejarGuardarUsuario}
        />
      )}
    </div>
  );
}