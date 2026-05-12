import React from 'react';
import './Footer.css';
export default function Footer() {
  return (
    <footer className="footer-main">
      <div className="footer-container">
        {/* Columna 1: Marca */}
        <div className="footer-col">
          <div className="footer-logo">
            <h3>ARTURO ROJAS</h3>
          </div>
          <p className="footer-desc">
            Especialistas en construcción, acabados y remodelaciones con más de 15 años de experiencia.
          </p>
          <div className="footer-socials">
            <span className="social-icon">fb</span>
            <span className="social-icon">ig</span>
            <span className="social-icon">in</span>
          </div>
        </div>

        {/* Columna 2: Enlaces */}
        <div className="footer-col">
          <h4>Enlaces Rápidos</h4>
          <ul>
            <li>Inicio</li>
            <li>Servicios</li>
            <li>Asesoría IA</li>
            <li>Contacto</li>
          </ul>
        </div>

        {/* Columna 3: Servicios */}
        <div className="footer-col">
          <h4>Servicios</h4>
          <ul>
            <li>Acabados en Drywall</li>
            <li>Pisos y Azulejos</li>
            <li>Remodelación de Baños</li>
          </ul>
        </div>

        {/* Columna 4: Newsletter */}
        <div className="footer-col">
          <h4>Newsletter</h4>
          <div className="newsletter-box">
            <input type="email" placeholder="Tu correo" />
            <button>✈️</button>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2026 Construcciones y Acabados Arturo Rojas. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
}