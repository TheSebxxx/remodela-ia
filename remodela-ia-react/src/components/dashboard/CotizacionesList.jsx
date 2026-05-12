import React from 'react';

export default function CotizacionesList({ cotizaciones, onRefresh }) {
  
  const actualizarEstado = async (id, nuevoEstado) => {
    const { error } = await supabase
      .from('cotizaciones')
      .update({ estado: nuevoEstado })
      .eq('id', id);
    
    if (!error) onRefresh();
  };

  return (
    <section className="details-card" style={{ gridColumn: '1 / -1', marginTop: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
        <h3>📋 Cotizaciones Pendientes</h3>
        <button onClick={onRefresh} className="btn-refresh-small">Sincronizar ↻</button>
      </div>

      <div className="table-container">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Proyecto</th>
              <th>Total Estimado</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {cotizaciones.map((cot) => (
              <tr key={cot.id}>
                <td>{new Date(cot.created_at).toLocaleDateString()}</td>
                <td>
                  <strong>{cot.perfiles?.nombre_completo}</strong>
                  <br />
                  <small style={{ color: '#94a3b8' }}>{cot.perfiles?.telefono}</small>
                </td>
                <td>{cot.detalles_json?.tipo || 'Remodelación'}</td>
                <td style={{ color: '#6ee7b7', fontWeight: 'bold' }}>
                  ${Number(cot.total_estimado).toLocaleString()}
                </td>
                <td>
                  <span className={`status-pill ${cot.estado}`}>
                    {cot.estado}
                  </span>
                </td>
                <td className="actions-cell">
                  <button className="btn-edit" onClick={() => window.open(cot.pdf_url, '_blank')}>
                    Ver PDF
                  </button>
                  <select 
                    className="admin-select-small"
                    value={cot.estado}
                    onChange={(e) => actualizarEstado(cot.id, e.target.value)}
                  >
                    <option value="pendiente">Pendiente</option>
                    <option value="en_revision">En Revisión</option>
                    <option value="completado">Finalizado</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}