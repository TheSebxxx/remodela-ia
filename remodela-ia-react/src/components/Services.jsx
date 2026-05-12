import React from 'react';
import './Services.css';

export default function Services() {
  const servicios = [
    {
      id: 1,
      titulo: "Acabados en Drywall",
      descripcion: "Instalación profesional de muros y cielos rasos con acabados de primera calidad.",
      imagen: "https://images.unsplash.com/photo-1513694203232-719a280e022f?q=80&w=500", // Ejemplo de drywall
      icono: "🔄"
    },
    {
      id: 2,
      titulo: "Pisos y Azulejos",
      descripcion: "Colocación de cerámica, porcelanato, mármol y todo tipo de pisos.",
      imagen: "https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?q=80&w=500", // Ejemplo pisos
      icono: "⊞"
    },
    {
      id: 3,
      titulo: "Pintura Interior/Exterior",
      descripcion: "Acabados de pintura de alta calidad para embellecer tus espacios.",
      imagen: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?q=80&w=500", // Ejemplo pintura
      icono: "🎨"
    },
    {
      id: 4,
      titulo: "Remodelación de Baños",
      descripcion: "Transformación completa de baños con diseños modernos y funcionales.",
      imagen: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=500", // Ejemplo baños
      icono: "🛁"
    },
    {
      id: 5,
      titulo: "Remodelación de Cocinas",
      descripcion: "Diseño y ejecución de cocinas modernas, funcionales y elegantes.",
      imagen: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?q=80&w=500", // Ejemplo cocina
      icono: "🍴"
    },
    {
      id: 6,
      titulo: "Diseño de Interiores",
      descripcion: "Asesoría profesional para crear espacios únicos y personalizados.",
      imagen: "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?q=80&w=500", // Ejemplo diseño
      icono: "🛠"
    }
  ];

  return (
    <section className="services-section">
      <div className="services-header">
        <span className="services-subtitle">NUESTROS SERVICIOS</span>
        <h2>Soluciones integrales para tu hogar</h2>
      </div>

      <div className="services-grid">
        {servicios.map((s) => (
          <div key={s.id} className="service-card">
            <div className="service-image" style={{ backgroundImage: `url(${s.imagen})` }}>
            </div>
            <div className="service-content">
              <div className="service-icon-box">{s.icono}</div>
              <h3>{s.titulo}</h3>
              <p>{s.descripcion}</p>
              <a href="#" className="ver-mas-link">Ver más</a>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}