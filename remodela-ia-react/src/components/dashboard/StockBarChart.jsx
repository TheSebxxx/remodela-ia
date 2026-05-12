import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

export default function StockBarChart({ materiales = [] }) {
  // Procesamos los datos asegurando que el stock sea un número
  const data = materiales.slice(0, 6).map(item => ({
    name: item.nombre.split(' ')[0], // Nombre corto para el eje X
    stock: Number(item.stock_actual) || 0,
    fullName: item.nombre,
    unidad: item.unidad_medida
  }));

  const COLORS = ['#38bdf8', '#818cf8', '#c084fc', '#f472b6', '#fb7185', '#fb923c'];

  return (
    <div className="chart-wrapper">
      <h3 className="chart-title">Niveles de Stock</h3>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
            <XAxis dataKey="name" stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
            <Tooltip 
              cursor={{fill: 'rgba(255, 255, 255, 0.05)'}}
              contentStyle={{ background: '#0f172a', border: '1px solid #334155', borderRadius: '8px' }}
              itemStyle={{ color: '#38bdf8' }}
              formatter={(value, name, props) => [`${value} ${props.payload.unidad}`, 'Existencias']}
            />
            <Bar dataKey="stock" radius={[4, 4, 0, 0]} barSize={35}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}