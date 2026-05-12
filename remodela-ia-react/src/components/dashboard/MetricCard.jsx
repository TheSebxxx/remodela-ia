const MetricCard = ({ titulo, valor, icono, color }) => {
  return (
    <div style={{
      background: '#1e293b',
      padding: '20px',
      borderRadius: '15px',
      borderLeft: `5px solid ${color || '#ec4899'}`,
      minWidth: '200px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
    }}>
      <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.9rem' }}>{titulo}</p>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '10px' }}>
        <span style={{ fontSize: '1.5rem' }}>{icono}</span>
        <h2 style={{ margin: 0, fontSize: '1.8rem', color: 'white' }}>{valor}</h2>
      </div>
    </div>
  );
};

// ESTA ES LA LÍNEA QUE FALTA:
export default MetricCard;