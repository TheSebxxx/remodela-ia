import React, { useState } from 'react';
import MetricsGrid from './MetricsGrid';
import UsuariosPieChart from './UsuariosPieChart';
import StockBarChart from './StockBarChart';
import './GlobalMetrics.css'; 

const GlobalMetrics = ({ materiales = [], usuarios = [], tareas = [], onRefresh }) => {
  // Estado local para filtrar por el estado de la solicitud (Pendiente, En revisión, etc.)
  const [filtroRapido, setFiltroRapido] = useState('Todos');

  // Filtrado exclusivo para solicitudes de clientes
  const solicitudesMostradas = filtroRapido === 'Todos' 
    ? tareas 
    : tareas.filter(t => t.estado === filtroRapido);

  return (
    <div className="global-metrics-container">
      <header className="metrics-header">
        <div>
          <h1 className='titulo'>Panel de Control</h1>
          <p>Resumen de <strong>Solicitudes de Clientes (App)</strong></p>
        </div>
        <button className="btn-refresh" onClick={onRefresh}>
          <span className="icon">🔄</span> Sincronizar Datos
        </button>
      </header>

      {/* Tarjetas Superiores */}
      <MetricsGrid 
        materialesCount={materiales.length} 
        usuariosCount={usuarios.length} 
        cotizacionesCount={tareas.length} // Total de solicitudes recibidas
        materiales={materiales} 
        tareas={tareas}
      />

      <div className="metrics-details-grid">
        {/* SECCIÓN INVENTARIO */}
        <section className="details-card">
          <h3>📦 Estado del Inventario</h3>
          <div className="inventory-list">
            {materiales.length > 0 ? (
              materiales.slice(0, 5).map(item => (
                <div key={item.id} className="inventory-item">
                  <span className="item-name">{item.nombre}</span>
                  <span className={`stock-badge ${Number(item.stock_actual) < 5 ? 'low' : 'ok'}`}>
                    {item.stock_actual} {item.unidad_medida || 'Und'}
                  </span>
                </div>
              ))
            ) : (
              <p className="empty-msg">No hay materiales registrados.</p>
            )}
          </div>
        </section>

        {/* SECCIÓN SOLICITUDES DE CLIENTES */}
        <section className="details-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
            <h3>📩 Solicitudes Recientes</h3>
            <select 
              value={filtroRapido} 
              onChange={(e) => setFiltroRapido(e.target.value)}
              className="mini-filter-select"
              style={{ 
                background: '#1e293b', 
                color: '#94a3b8', 
                border: '1px solid #334155', 
                fontSize: '0.75rem',
                borderRadius: '5px',
                padding: '2px 5px'
              }}
            >
              <option value="Todos">Todas</option>
              <option value="Pendiente">Pendientes</option>
              <option value="En revisión">En revisión</option>
              <option value="Completado">Completadas</option>
            </select>
          </div>

          <div className="tasks-list">
            {solicitudesMostradas.length > 0 ? (
              solicitudesMostradas.slice(0, 5).map(sol => (
                <div key={sol.id} className="task-item">
                  {/* El punto de prioridad depende del estado de la solicitud del cliente */}
                  <div className={`priority-dot ${sol.estado === 'Pendiente' ? 'alta' : 'media'}`}></div>
                  <div className="task-info">
                    <p className="task-title" style={{ fontWeight: 'bold' }}>
                      {sol.perfiles?.nombre_completo || 'Usuario App'}
                    </p>
                    <p className="task-status">
                      {new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(sol.total_estimado || 0)} - {sol.estado}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="empty-msg">No hay solicitudes de clientes para este filtro.</p>
            )}
          </div>
        </section>
      </div>

      <div className="charts-dashboard-grid">
        <UsuariosPieChart usuarios={usuarios} />
        <StockBarChart materiales={materiales} />
      </div>
    </div>
  );
};

export default GlobalMetrics;