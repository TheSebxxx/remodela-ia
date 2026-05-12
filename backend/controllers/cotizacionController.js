const { supabase } = require('../lib/supabaseClient');

// Guardar nueva cotización
exports.guardarCotizacion = async (req, res) => {
    const { usuario_id, total_estimado, detalles_json } = req.body;
    
    // LOG DE CONTROL: Mira esto en tu terminal negra
    console.log("Datos recibidos en el backend:", { usuario_id, total_estimado });

    try {
        const { data, error } = await supabase
    .from('cotizaciones')
    .insert([{ 
        usuario_id, 
        total_estimado, 
        detalles_json,
        estado: 'Pendiente' // Asegúrate de que coincida con el SQL
    }]);

        if (error) {
            // SI SUPABASE RESPONDE ERROR, LO VERÁS AQUÍ
            console.error("❌ Error específico de Supabase:", error);
            return res.status(400).json({ error: error.message, details: error.details });
        }
        
        res.json({ message: "Guardado exitoso", data });
    } catch (error) {
        // SI EL CÓDIGO EXPLOTA (EJ: SUPABASE NO ESTÁ DEFINIDO)
        console.error("❌ Error de ejecución en Node:", error);
        res.status(500).json({ error: "Error interno", mensaje: error.message });
    }
};

// Obtener historial de un usuario
exports.obtenerHistorial = async (req, res) => {
    const { usuario_id } = req.params;
    try {
        const { data, error } = await supabase
            .from('cotizaciones')
            .select('*')
            .eq('usuario_id', usuario_id)
            .order('created_at', { ascending: false });
        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};