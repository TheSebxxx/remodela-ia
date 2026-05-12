// FORMATO NODE.JS (BACKEND)
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config(); // Esto lee el .env de la carpeta backend

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl) {
    console.error("❌ El Backend no encuentra SUPABASE_URL. Revisa el .env de la carpeta backend.");
}

const supabase = createClient(supabaseUrl, supabaseKey);

module.exports = { supabase };