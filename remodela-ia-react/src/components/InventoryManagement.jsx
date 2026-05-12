import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import MaterialForm from './MaterialForm';
import './InventoryManagement.css';

export default function InventoryManagement() {
  const [materiales, setMateriales] = useState([]);
  const [filtroCategoria, setFiltroCategoria] = useState('Todos');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [materialAEditar, setMaterialAEditar] = useState(null);

  const obtenerMateriales = async () => {
    try {
      const { data, error } = await supabase
        .from('catalogo_materiales')
        .select('*')
        .order('nombre', { ascending: true });
      
      if (error) throw error;
      setMateriales(data || []);
    } catch (error) {
      console.error("Error cargando materiales:", error.message);
    }
  };

  const manejarGuardar = async (datos) => {
    const { id, ...datosParaGuardar } = datos;
    let error;

    if (id) {
      const { error: err } = await supabase
        .from('catalogo_materiales')
        .update(datosParaGuardar)
        .eq('id', id);
      error = err;
    } else {
      const { error: err } = await supabase
        .from('catalogo_materiales')
        .insert([datosParaGuardar]);
      error = err;
    }

    if (!error) {
      setMostrarModal(false);
      setMaterialAEditar(null);
      obtenerMateriales();
    } else {
      alert("Error: " + error.message);
    }
  };

  const eliminarMaterial = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este material?")) {
      const { error } = await supabase.from('catalogo_materiales').delete().eq('id', id);
      if (!error) obtenerMateriales();
    }
  };

  useEffect(() => {
    obtenerMateriales();
  }, []);

  const categoriasUnicas = ['Todos', ...new Set(materiales.map(m => m.categoria))];
  const materialesFiltrados = materiales.filter(m => 
    filtroCategoria === 'Todos' || m.categoria === filtroCategoria
  );

  // Función para formatear moneda COP
  const formatoMoneda = (valor) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      maximumFractionDigits: 0
    }).format(valor);
  };

  return (
    <div className="view-fade">
      <header className="content-header">
        <h1 className='titulo'>Gestión de Materiales</h1>
        <div className="header-actions">
          <select 
            className="admin-select" 
            value={filtroCategoria} 
            onChange={(e) => setFiltroCategoria(e.target.value)}
          >
            {categoriasUnicas.map(cat => <option key={cat} value={cat}>{cat}</option>)}
          </select>
          <button className="btn-add" onClick={() => { setMaterialAEditar(null); setMostrarModal(true); }}>
            +
          </button>
        </div>
      </header>
      
      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              {/* Priorizamos el stock visualmente */}
              <th style={{ width: '130px' }}>Stock</th>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Precio Unitario</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {materialesFiltrados.length > 0 ? (
              materialesFiltrados.map(m => (
                <tr key={m.id}>
                  <td>
                    <div className={`stock-badge-table ${m.stock_actual < 5 ? 'low' : 'ok'}`}>
                      {m.stock_actual} {m.unidad_medida}
                    </div>
                  </td>
                  <td><strong>{m.nombre}</strong></td>
                  <td><span className="cat-tag">{m.categoria}</span></td>
                  <td>{formatoMoneda(m.precio_unitario)}</td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => { setMaterialAEditar(m); setMostrarModal(true); }}>Editar</button>
                    <button className="btn-delete" onClick={() => eliminarMaterial(m.id)}>Eliminar</button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '40px' }}>
                  No hay materiales registrados en Chronos Studio.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {mostrarModal && (
        <MaterialForm 
    // La 'key' hace que React reinicie el componente si el ID cambia
    key={materialAEditar?.id || 'nuevo'} 
    alCerrar={() => { setMostrarModal(false); setMaterialAEditar(null); }}
    alGuardar={manejarGuardar}
    materialEditando={materialAEditar}
        />
      )}
    </div>
  );
}