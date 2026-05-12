import React from 'react';
import './Hero.css';
export default function Hero({ setVista }) {
  return (
    <section className="hero-section">
      <div className="hero-container">
        {/* Columna de contenido (izquierda) */}
        <div className="hero-content">
          <span className="experience-badge">
            15+ Años de experiencia
          </span>
          
          <h1>
            Transformamos tus espacios con{' '}
            <span className="highlight-quality">calidad</span> y{' '}
            <span className="highlight-pro">profesionalismo</span>
          </h1>
          
          <p>
            Especialistas en acabados, remodelaciones y diseño de interiores. 
            Utiliza nuestro asistente de IA para visualizar tu proyecto antes de comenzar.
          </p>
          
          <div className="hero-actions">
            <button 
              className="btn-cotiza-ia" 
              onClick={() => setVista('ia')}
            >
              <span className="icon">🤖</span> Cotiza Gratis con IA
            </button>
            <button 
              className="btn-ver-proyectos"
              onClick={() => setVista('servicios')}
            >
              <span className="icon">🖼️</span> Ver Proyectos
            </button>
          </div>
        </div>
        
        {/* Columna vacía (derecha) para el degradado */}
        <div className="hero-spacer"></div>
      </div>
    </section>
  );
}