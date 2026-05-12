const { supabase } = require('../lib/supabaseClient');

// REGISTRO
exports.registrar = async (req, res) => {
    try {
        const { nombre, email, password, telefono } = req.body;

        // 1. Registro en Supabase Auth
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });

        if (error) throw error;

        // 2. Insertar en 'perfiles' INCLUYENDO el email que pide la base de datos
        if (data.user) {
            const { error: profileError } = await supabase
                .from('perfiles')
                .insert([
                    { 
                        id: data.user.id, 
                        nombre_completo: nombre, 
                        email: email, // 👈 ¡Faltaba esta línea para solucionar lo de "osa polar"!
                        rol: 'cliente',
                        telefono: telefono || null // Evita errores si viene vacío
                    }
                ]);
            
            if (profileError) throw profileError;
        }

        res.status(201).json({ mensaje: "Usuario creado con éxito." });
    } catch (error) {
        console.error("Error en Registro:", error.message);
        res.status(400).json({ error: error.message });
    }
};

// LOGIN
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) return res.status(401).json({ error: "Credenciales inválidas" });

        // Buscamos el perfil con maybeSingle() corregido
        const { data: perfil, error: perfilError } = await supabase
            .from('perfiles')
            .select('nombre_completo, rol')
            .eq('id', data.user.id)
            .maybeSingle(); // 👈 Corregida la mayúscula

        if (perfilError) throw perfilError;

        // Si no hay perfil aún, enviamos datos genéricos para evitar el error 500
        const nombreFinal = perfil ? perfil.nombre_completo : "Usuario Nuevo";
        const rolFinal = perfil ? perfil.rol : "cliente";

        res.json({ 
            token: data.session.access_token, 
            usuarioId: data.user.id, 
            nombre: nombreFinal,
            rol: rolFinal 
        });
    } catch (error) {
        console.error("Error en Login:", error);
        res.status(500).json({ error: "Error en el servidor" });
    }
};