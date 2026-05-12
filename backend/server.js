const express = require('express');
const path = require('path');
require('dotenv').config();
const twilio = require('twilio');
const cors = require('cors');

const chatRoutes = require('./routes/chatRoutes');
const authRoutes = require('./routes/authRoutes');
const materialRoutes = require('./routes/materialRoutes');
const cotizacionController = require('./controllers/cotizacionController');

const app = express();

// --- 1. CONFIGURACIÓN DE MIDDLEWARES ---
app.use(cors());
app.use(express.json()); // Para el Chat y Auth (JSON)
app.use('/api/materiales', materialRoutes);
app.use(express.urlencoded({ extended: false })); // SUBE ESTA LÍNEA AQUÍ (Para Twilio)

// --- 2. RUTAS API ---
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.post('/api/cotizaciones/guardar', cotizacionController.guardarCotizacion);
app.get('/api/cotizaciones/historial/:usuario_id', cotizacionController.obtenerHistorial);

// Servir archivos estáticos
app.use(express.static(path.join(__dirname, '../frontend/dist')));

// 3. WhatsApp (Twilio)
const client = new twilio(
  process.env.TWILIO_ACCOUNT_SID, 
  process.env.TWILIO_AUTH_TOKEN
);

app.post('/api/whatsapp', async (req, res) => {
  const { nombre, telefono, tipoProyecto, mensaje } = req.body;

  try {
    const response = await client.messages.create({
      from: process.env.TWILIO_PHONE_NUMBER,
      to: process.env.MY_PHONE_NUMBER,
      body: `🏗️ *Nueva Solicitud de Remodelación*\n\n` +
            `👤 *Cliente:* ${nombre}\n` +
            `📞 *Teléfono:* ${telefono}\n` +
            `🏠 *Proyecto:* ${tipoProyecto}\n` +
            `💬 *Mensaje:* ${mensaje}`
    });

    console.log("✅ WhatsApp enviado:", response.sid);
    res.status(200).json({ success: true, sid: response.sid });
  } catch (error) {
    console.error("❌ Error Twilio:", error);
    res.status(500).json({ success: false, error: 'No se pudo enviar el mensaje' });
  }
});

// --- 3. MANEJO DE FRONTEND (SPA) ---
// Esta expresión regular evita el PathError en Node v24 que viste anteriormente
app.get(/^(?!\/api).+/, (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
});

// --- 4. LANZAMIENTO ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor Remodela-IA corriendo en puerto ${PORT}`);
  console.log(`☁️ Supabase y Twilio configurados correctamente`);
});
