import React, { useState } from 'react';
import './MaterialForm.css';

export default function MaterialForm({ alCerrar, alGuardar, materialEditando = null }) {
  // Inicializamos el estado directamente con el material a editar o con valores vacíos.
  // Esto evita el error de "cascading renders" al no depender de un useEffect.
  const [datos, setDatos] = useState(materialEditando || {
    nombre: '',
    descripcion: '',
    categoria: 'Pisos',
    precio_unitario: 0,
    unidad_medida: 'm2',
    stock_actual: 0,
    imagen_url: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Enviamos los datos (el ID se mantiene si venía en materialEditando)
    alGuardar(datos);
  };

  return (
    <div className="modal-overlay">
      <div className="admin-modal view-fade">
        <div className="modal-header">
          <h2>{materialEditando ? '📝 Editar Material' : '✨ Nuevo Material'}</h2>
          <p className="modal-subtitle">
            {materialEditando ? 'Modifica los detalles del insumo' : 'Registra un nuevo producto para Chronos Studio'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-group">
            <label>Nombre del Material</label>
            <input 
              type="text" 
              placeholder="Ej: Estuco Plástico"
              required 
              value={datos.nombre}
              onChange={(e) => setDatos({...datos, nombre: e.target.value})} 
            />
          </div>
          
          <div className="form-row">
            <div className="form-group">
              <label>Categoría</label>
              <select 
                value={datos.categoria} 
                onChange={(e) => setDatos({...datos, categoria: e.target.value})}
              >
                <option value="Pisos">Pisos</option>
                <option value="Paredes">Paredes</option>
                <option value="Iluminación">Iluminación</option>
                <option value="Baños">Baños</option>
                <option value="Drywall">Drywall</option>
                <option value="Herramientas">Herramientas</option>
                <option value="Otros">Otros</option>
              </select>
            </div>
            <div className="form-group">
              <label>Unidad de Medida</label>
              <input 
                type="text" 
                placeholder="Ej: m2, Galón, Bulto"
                required
                value={datos.unidad_medida} 
                onChange={(e) => setDatos({...datos, unidad_medida: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Precio Unitario (COP)</label>
              <input 
                type="number" 
                required 
                min="0"
                value={datos.precio_unitario} 
                onChange={(e) => setDatos({...datos, precio_unitario: e.target.value})} 
              />
            </div>
            <div className="form-group">
              <label>Stock Actual</label>
              <input 
                type="number" 
                min="0"
                value={datos.stock_actual} 
                onChange={(e) => setDatos({...datos, stock_actual: e.target.value})} 
              />
            </div>
          </div>

          <div className="form-group">
            <label>Descripción</label>
            <textarea 
              placeholder="Detalles adicionales del material..."
              rows="2"
              value={datos.descripcion || ''} 
              onChange={(e) => setDatos({...datos, descripcion: e.target.value})}
            />
          </div>

          {/* Ocultamos el campo de imagen pero lo mantenemos en el estado por si se usa a futuro */}
          <input 
            type="hidden" 
            value={datos.imagen_url || ''} 
          />

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={alCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              {materialEditando ? 'Actualizar Cambios' : 'Guardar Material'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}