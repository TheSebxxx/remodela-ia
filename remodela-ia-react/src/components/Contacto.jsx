import React, { useState } from 'react';
import './Contacto.css';

export default function Contacto() {
  // 1. Estado para capturar los datos del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    telefono: '',
    email: '',
    tipoProyecto: 'Remodelación de Baño',
    mensaje: ''
  });

  // 2. Función para manejar los cambios en los inputs
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 3. Función para enviar los datos al Backend (Twilio)
  const manejarEnvio = async (e) => {
    e.preventDefault();
    
    try {
      const res = await fetch('http://localhost:3000/api/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (data.success) {
        alert("🚀 ¡Mensaje enviado! Arturo Rojas recibirá tu solicitud por WhatsApp.");
        // Opcional: Limpiar el formulario
        setFormData({ nombre: '', telefono: '', email: '', tipoProyecto: 'Remodelación de Baño', mensaje: '' });
      } else {
        alert("❌ Error al enviar el mensaje.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("📡 Error de conexión con el servidor.");
    }
  };

  // 4. Función para el botón directo de WhatsApp (Sin Twilio, directo al chat)
  const abrirWhatsAppDirecto = () => {
    const numero = "573174968327"; // Tu número real aquí
    const texto = window.encodeURIComponent("Hola Arturo, vi tu página y me gustaría cotizar una remodelación.");
    window.open(`https://wa.me/${numero}?text=${texto}`, '_blank');
  };

  return (
    <section className="contacto-section">
      <div className="contacto-header">
        <span className="subtitle">CONTÁCTANOS</span>
        <h2>¿Listo para transformar tu espacio?</h2>
        <p>Déjanos tu mensaje y nuestro equipo se pondrá en contacto contigo en menos de 24 horas.</p>
      </div>

      <div className="contacto-container">
        {/* LADO IZQUIERDO: FORMULARIO */}
        <div className="contacto-form-card">
          <h3>Envíanos un mensaje</h3>
          <form className="form-grid" onSubmit={manejarEnvio}>
            <div className="form-group">
              <label>Nombre Completo</label>
              <input 
                type="text" 
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                placeholder="Ej. Juan Pérez" 
                required 
              />
            </div>
            <div className="form-group">
              <label>Teléfono</label>
              <input 
                type="tel" 
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                placeholder="+57 300..." 
                required 
              />
            </div>
            <div className="form-group full-width">
              <label>Correo electrónico</label>
              <input 
                type="email" 
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="tu@email.com" 
                required 
              />
            </div>
            <div className="form-group full-width">
              <label>Tipo de proyecto</label>
              <select name="tipoProyecto" value={formData.tipoProyecto} onChange={handleChange}>
                <option value="Remodelación de Baño">Remodelación de Baño</option>
                <option value="Acabados en Drywall">Acabados en Drywall</option>
                <option value="Pisos y Azulejos">Pisos y Azulejos</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Mensaje</label>
              <textarea 
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                placeholder="Cuéntanos un poco más sobre tu idea..." 
                required
              ></textarea>
            </div>
            <button type="submit" className="btn-enviar">
              🚀 Enviar Mensaje
            </button>
          </form>
        </div>

        {/* LADO DERECHO: INFO DE CONTACTO */}
        <div className="contacto-info-side">
          <div className="info-card-dark">
            <h3>Información de Contacto</h3>
            <div className="info-item">
              <div className="info-icon">📞</div>
              <div>
                <p className="info-label">Teléfonos</p>
                <p>+57 300 123 4567</p>
                <p>+57 601 234 5678</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">✉️</div>
              <div>
                <p className="info-label">Email</p>
                <p>info@arturorojas.co</p>
              </div>
            </div>
            <div className="info-item">
              <div className="info-icon">📍</div>
              <div>
                <p className="info-label">Ubicación</p>
                <p>Calle 123 # 45-67, Bogotá, Colombia</p>
              </div>
            </div>
          </div>

          <div className="quick-actions">
            <p>Comunícate directamente</p>
            <button className="btn-direct-ws" onClick={abrirWhatsAppDirecto}>
              <span>💬</span> WhatsApp
            </button>
            <button className="btn-direct-call" onClick={() => window.location.href = 'tel:+573001234567'}>
              <span>📞</span> Llamar Ahora
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}