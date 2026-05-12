import React, { useState } from 'react';
import './UserForm.css';

export default function UserForm({ alCerrar, alGuardar, usuarioEditando = null }) {
  // Inicializamos el estado incluyendo el ID si existe
  const [formData, setFormData] = useState({
    id: usuarioEditando?.id || null, 
    nombre_completo: usuarioEditando?.nombre_completo || '',
    telefono: usuarioEditando?.telefono || '',
    rol: usuarioEditando?.rol || 'cliente',
    email: usuarioEditando?.email || '', 
    password: '' // Solo requerido para nuevos
  });

  const esNuevo = !usuarioEditando;

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validar contraseña si es nuevo
    if (esNuevo && formData.password.length < 6) {
      alert("La contraseña debe tener al menos 6 caracteres.");
      return;
    }
    alGuardar(formData);
  };

  return (
    <div className="modal-overlay">
      <div className="admin-modal view-fade">
        <div className="modal-header">
          <h2>{esNuevo ? '✨ Registrar Nuevo Usuario' : '📝 Editar Perfil'}</h2>
          <p className="modal-subtitle">
            {esNuevo 
              ? 'Crea una nueva cuenta de acceso para el sistema' 
              : `Modificando datos de acceso para: ${usuarioEditando.email}`}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              placeholder="correo@ejemplo.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required 
              disabled={!esNuevo} 
            />
          </div>

          {esNuevo && (
            <div className="form-group">
              <label>Contraseña Temporal</label>
              <input 
                type="password" 
                placeholder="Mínimo 6 caracteres"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required={esNuevo}
              />
            </div>
          )}

          <div className="form-group">
            <label>Nombre Completo</label>
            <input 
              type="text" 
              placeholder="Nombre y Apellidos"
              value={formData.nombre_completo}
              onChange={(e) => setFormData({...formData, nombre_completo: e.target.value})}
              required 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                type="text" 
                placeholder="Ej: 317..."
                value={formData.telefono}
                onChange={(e) => setFormData({...formData, telefono: e.target.value})}
              />
            </div>

            <div className="form-group">
              <label>Rol del Sistema</label>
              <select 
                value={formData.rol}
                onChange={(e) => setFormData({...formData, rol: e.target.value})}
                className="admin-select"
              >
                <option value="cliente">Cliente (Acceso estándar)</option>
                <option value="admin">Administrador (Acceso total)</option>
              </select>
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={alCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {esNuevo ? 'Crear Usuario' : 'Actualizar Perfil'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}