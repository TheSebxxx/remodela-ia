import React, { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function GestionCotizaciones({ cotizaciones, onRefresh }) {
  // Estado para el filtro de búsqueda
  const [filtroEstado, setFiltroEstado] = useState('Todos');

  const actualizarEstado = async (id, nuevoEstado) => {
    try {
      const { error } = await supabase
        .from('cotizaciones')
        .update({ estado: nuevoEstado })
        .eq('id', id);

      if (error) throw error;
      onRefresh(); 
    } catch (error) {
      console.error("Error al actualizar:", error.message);
      alert("Error técnico: " + error.message);
    }
  };

  const descargarPDF = (cot) => {
    const doc = new jsPDF();
    const detalles = cot.detalles_json;
    doc.setFontSize(18);
    doc.text("REMODELA-IA - COMPROBANTE", 14, 20);
    doc.setFontSize(10);
    doc.text(`Cliente: ${cot.perfiles?.nombre_completo}`, 14, 30);
    
    const filas = detalles?.items?.map(item => [
      item.nombre,
      `${item.cantidad} ${item.unidad}`,
      `$${item.precioUnitario?.toLocaleString()}`,
      `$${item.total?.toLocaleString()}`
    ]) || [];

    autoTable(doc, {
      startY: 45,
      head: [['Material', 'Cantidad', 'Precio U.', 'Subtotal']],
      body: filas,
      headStyles: { fillColor: [244, 114, 182] }
    });

    doc.save(`Cotizacion_${cot.perfiles?.nombre_completo}.pdf`);
  };

  // --- LÓGICA DE FILTRADO ---
  const cotizacionesFiltradas = filtroEstado === 'Todos' 
    ? cotizaciones 
    : cotizaciones.filter(c => c.estado === filtroEstado);

  return (
    <div className="gestion-container view-fade">
      <div className="header-flex" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px' 
      }}>
        <h2 className='titulo'>Gestionar Solicitudes</h2>
        
        {/* Selector de Filtro */}
        <div className="filtro-wrapper" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <label style={{ fontSize: '0.9rem', color: '#94a3b8' }}>Filtrar por:</label>
          <select 
            value={filtroEstado} 
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="action-select"
            style={{ padding: '8px', borderRadius: '8px', background: '#1e293b', color: 'white' }}
          >
            <option value="Todos">Ver Todas</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En revisión">En revisión</option>
            <option value="Completado">Completados</option>
          </select>
        </div>
      </div>

      <div className="table-responsive">
        <table className="admin-table">
          <thead>
            <tr>
              <th>CLIENTE</th>
              <th>PROYECTO</th>
              <th>TOTAL</th>
              <th>ESTADO ACTUAL</th>
              <th>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {cotizacionesFiltradas.length > 0 ? (
              cotizacionesFiltradas.map(cot => (
                <tr key={cot.id}>
                  <td>
                    <strong>{cot.perfiles?.nombre_completo}</strong><br/>
                    <small>{cot.perfiles?.telefono}</small>
                  </td>
                  <td>{cot.detalles_json?.tipo || 'Remodelación'}</td>
                  <td style={{ fontWeight: 'bold', color: '#6ee7b7' }}>
                    ${Number(cot.total_estimado).toLocaleString()}
                  </td>
                  <td>
                    <span className={`status-pill ${cot.estado?.toLowerCase().replace(' ', '_')}`}>
                      {cot.estado?.toUpperCase()}
                    </span>
                  </td>
                  <td className="actions-cell">
                    <button className="btn-edit" onClick={() => descargarPDF(cot)} style={{ marginRight: '10px' }}>
                      📄 PDF
                    </button>
                    <select 
                      value={cot.estado} 
                      onChange={(e) => actualizarEstado(cot.id, e.target.value)}
                      className="action-select"
                    >
                      <option value="Pendiente">Pendiente</option>
                      <option value="En revisión">En revisión</option>
                      <option value="Completado">Completado</option>
                    </select>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" style={{ textAlign: 'center', padding: '30px', color: '#94a3b8' }}>
                  No se encontraron cotizaciones con el estado: <strong>{filtroEstado}</strong>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}