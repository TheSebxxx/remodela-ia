const Material = require('../models/Material');

exports.obtenerMateriales = async (req, res) => {
    try {
        // Capturamos los filtros de la query string (ej: ?categoria=Pisos)
        const filtros = req.query;
        const data = await Material.findAll(filtros);
        res.json(data);
    } catch (error) {
        console.error("Error al obtener materiales:", error.message);
        res.status(500).json({ error: "Error interno del servidor" });
    }
};