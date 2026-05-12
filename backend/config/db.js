// backend/config/db.js
const { createClient } = require('@supabase/supabase-js');

const conectarDB = () => {
    try {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseKey) {
            throw new Error("Faltan las credenciales de Supabase en el .env");
        }

        const supabase = createClient(supabaseUrl, supabaseKey);
        
        console.log("Supabase Cloud conectado con éxito 🚀");
        return supabase;
    } catch (error) {
        console.error("❌ Error al conectar con Supabase:", error.message);
        process.exit(1);
    }
};

// Exportamos la función para inicializarla en server.js si es necesario
// O mejor aún, exportamos el cliente ya creado
const supabase = conectarDB();
module.exports = supabase;
