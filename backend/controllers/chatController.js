const asesor = require('../models/ChatAsesor');
const { supabase } = require('../lib/supabaseClient');

// 1. PROCESAR NUEVO MENSAJE
exports.procesarChat = async (req, res) => {
    const { mensaje, usuarioId, chatId } = req.body;

    try {
        // Actualizado para Mariana
        console.log("Mensaje recibido de Mariana:", mensaje); 

        const respuestaIA = await asesor.generarRespuesta(mensaje);

        // Guardar en Supabase en segundo plano
        supabase.from('chats').insert([
            { 
                usuario_id: usuarioId, 
                chat_id: chatId, 
                mensaje_usuario: mensaje, 
                respuesta_ia: respuestaIA 
            }
        ]).then(({ error }) => {
            if (error) console.error("Error guardando en la DB:", error.message);
        });

        return res.json({ respuesta: respuestaIA });

    } catch (error) {
        console.error("Error en servidor:", error.message);
        return res.status(500).json({ respuesta: "Error de conexión interna." });
    }
};

// 2. OBTENER LISTA DE CHATS (HISTORIAL LATERAL)
exports.obtenerHistorial = async (req, res) => {
    const { usuarioId } = req.params;
    try {
        const { data, error } = await supabase
            .from('chats')
            .select('chat_id, mensaje_usuario, created_at')
            .eq('usuario_id', usuarioId)
            .order('created_at', { ascending: false });

        if (error) throw error;

        const vistos = new Set();
        const historialUnico = (data || []).filter(item => {
            if (!vistos.has(item.chat_id)) {
                vistos.add(item.chat_id);
                return true;
            }
            return false;
        });

        res.json(historialUnico.map(chat => ({
            id_del_chat: chat.chat_id,
            titulo: chat.mensaje_usuario.substring(0, 30),
            fecha: chat.created_at
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. OBTENER MENSAJES DE UN CHAT ESPECÍFICO (NUEVA)
exports.obtenerMensajesPorChat = async (req, res) => {
    const { chatId } = req.params;
    try {
        const { data, error } = await supabase
            .from('chats')
            .select('mensaje_usuario, respuesta_ia, created_at')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true }); // Orden cronológico

        if (error) throw error;
        res.json(data);
    } catch (error) {
        console.error("Error al recuperar mensajes:", error.message);
        res.status(500).json({ error: "No se pudieron cargar los mensajes." });
    }
};