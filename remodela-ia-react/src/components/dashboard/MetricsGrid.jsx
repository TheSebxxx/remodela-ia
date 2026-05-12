import React from 'react';
import MetricCard from './MetricCard';

const MetricsGrid = ({ materialesCount = 0, usuariosCount = 0, cotizacionesCount = 0, materiales = [] }) => {
  
  // Calculamos el stock bajo (menos de 5 unidades)
  const stockBajoCount = materiales?.filter(m => (m.stock_actual || 0) < 5).length || 0;

  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      flexWrap: 'wrap', 
      marginBottom: '30px',
      justifyContent: 'space-between' 
    }}>
      {/* 1. Total de Materiales */}
      <MetricCard 
        titulo="Total Materiales" 
        valor={materialesCount} 
        icono="📦" 
        color="#3b82f6" 
      />

      {/* 2. Usuarios del sistema */}
      <MetricCard 
        titulo="Usuarios Registrados" 
        valor={usuariosCount} 
        icono="👥" 
        color="#ec4899" 
      />

      {/* 3. NUEVO: Total de Cotizaciones en la base de datos */}
      <MetricCard 
        titulo="Cotizaciones Totales" 
        valor={cotizacionesCount} 
        icono="📑" 
        color="#a855f7" 
      />

      {/* 4. Alerta de Stock */}
      <MetricCard 
        titulo="Stock Bajo" 
        valor={stockBajoCount} 
        icono="⚠️" 
        color="#fbbf24" 
      />
    </div>
  );
};

export default MetricsGrid;