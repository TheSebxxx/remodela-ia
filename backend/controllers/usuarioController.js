const { supabase } = require('../lib/supabaseClient');

// Obtener todos los usuarios
exports.obtenerUsuarios = async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('perfiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Cambiar el rol de un usuario
exports.actualizarRol = async (req, res) => {
    const { id } = req.params;
    const { nuevoRol } = req.body;
    try {
        const { error } = await supabase
            .from('perfiles')
            .update({ rol: nuevoRol })
            .eq('id', id);

        if (error) throw error;
        res.json({ mensaje: "Rol actualizado correctamente" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
    const { id } = req.params;
    try {
        const { error } = await supabase
            .from('perfiles')
            .delete()
            .eq('id', id);

        if (error) throw error;
        res.json({ mensaje: "Usuario eliminado" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};