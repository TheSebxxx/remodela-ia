const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Ruta para procesar el chat (enviar mensaje)
router.post('/', chatController.procesarChat);

// Ruta para obtener la lista de chats previos (el menú lateral)
router.get('/historial/:usuarioId', chatController.obtenerHistorial);

// --- NUEVA RUTA: Obtener los mensajes de un chat específico ---
// Esta es la que llama cargarChatPasado en React
router.get('/mensajes/:chatId', chatController.obtenerMensajesPorChat);

module.exports = router;