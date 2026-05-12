import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

export default function UsuariosPieChart({ usuarios }) {
  // 1. Procesar los datos de la tabla 'perfiles'
  const dataMap = usuarios.reduce((acc, user) => {
    const rol = user.rol || 'cliente';
    acc[rol] = (acc[rol] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(dataMap).map(key => ({
    // Si el rol es 'admin', ponemos 'Administradores', de lo contrario 'Clientes'
    name: key === 'admin' ? 'Administradores' : 'Clientes',
    value: dataMap[key]
  }));

  // Colores neón consistentes con la marca Remodela-IA
  const COLORS = ['#f472b6', '#38bdf8']; 

  return (
    <div style={{ 
      width: '100%', 
      height: 380, // Aumentamos la altura para que quepa la leyenda
      background: 'rgba(30, 41, 59, 0.5)', 
      padding: '20px', 
      borderRadius: '15px', 
      border: '1px solid rgba(244, 114, 182, 0.2)',
      boxSizing: 'border-box'
    }}>
      <h3 style={{ color: '#fff', marginBottom: '20px', fontSize: '1.1rem', textAlign: 'center', fontWeight: '500' }}>
        Distribución de Usuarios
      </h3>
      
      <ResponsiveContainer width="100%" height="90%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="45%" // Subimos un poco el centro para dar espacio a la leyenda abajo
            innerRadius={65} // Un poco más grueso el anillo
            outerRadius={85}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((_entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          
          <Tooltip 
            contentStyle={{ 
              background: '#0f172a', 
              border: '1px solid #334155', 
              borderRadius: '8px', 
              color: '#fff',
              fontSize: '14px'
            }}
            itemStyle={{ color: '#fff' }}
          />
          
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ 
              paddingTop: '20px',
              fontSize: '14px',
              color: '#94a3b8'
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}