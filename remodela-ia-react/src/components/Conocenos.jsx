import React from 'react';
import './Conocenos.css';


export default function Conocenos() {
  const testimonios = [
    {
      id: 1,
      nombre: "Carlos Mendoza",
      cargo: "Propietario de Vivienda",
      comentario: "Excelente trabajo en la remodelación de mi baño. La asesoría con IA me ayudó a elegir los materiales perfectos y el resultado fue idéntico al diseño.",
      estrellas: 5
    },
    {
      id: 2,
      nombre: "Mariana Silva",
      cargo: "Arquitecta Independiente",
      comentario: "Arturo Rojas es mi aliado número uno para acabados en drywall. Puntualidad y acabados de lujo en cada proyecto que realizamos juntos.",
      estrellas: 5
    },
    {
      id: 3,
      nombre: "Jorge Tovar",
      cargo: "Administrador de Local Comercial",
      comentario: "Instalaron los pisos de mi local en tiempo récord. La calidad del porcelanato y la mano de obra es impecable. Totalmente recomendados.",
      estrellas: 5
    }
  ];

  return (
    <section className="conocenos-section">
      {/* --- BLOQUE 1: TESTIMONIOS --- */}
      <div className="conocenos-header">
        <span className="subtitle">VOCES DE NUESTROS CLIENTES</span>
        <h2>Nuestros <span className="text-orange">Testimonios</span></h2>
        <p>La confianza de nuestros clientes es el mejor acabado de cada proyecto.</p>
      </div>

      <div className="testimonios-grid">
        {testimonios.map((t) => (
          <div key={t.id} className="testimonio-card">
            <div className="quote-icon">“</div>
            <div className="estrellas">
              {"★".repeat(t.estrellas)}
            </div>
            <p className="comentario">{t.comentario}</p>
            <div className="cliente-info">
              <div className="avatar-fake">{t.nombre.charAt(0)}</div>
              <div>
                <strong>{t.nombre}</strong>
                <span>{t.cargo}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* --- BLOQUE 2: TRAYECTORIA (Separador Visual) --- */}
      <div className="trayectoria-header">
        <span className="subtitle">RESPALDO PROFESIONAL</span>
        <h3>Nuestra <span className="text-orange">Trayectoria</span></h3>
      </div>

      <div className="cifras-experiencia">
        <div className="cifra-item">
          <h3>+500</h3>
          <p>Proyectos Terminados</p>
        </div>
        <div className="cifra-item">
          <h3>100%</h3>
          <p>Clientes Satisfechos</p>
        </div>
        <div className="cifra-item">
          <h3>15</h3>
          <p>Años de Trayectoria</p>
        </div>
      </div>
    </section>
  );
}