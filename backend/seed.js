const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// 1. Configuración del cliente Supabase
const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_ANON_KEY
);

const materialesEjemplo = [
    {
        nombre: "Porcelanato Gris Mate 60x60",
        categoria: "Pisos",
        precio_unitario: 45000,
        unidad_medida: "m2",
        imagen_url: "https://images.unsplash.com/photo-1588854337221-4cf9fa96059c?q=80&w=300",
        descripcion: "Ideal para baños y cocinas modernas. Antideslizante.",
        stock_actual: 100
    },
    {
        nombre: "Azulejo Decorativo 3D Blanco",
        categoria: "Paredes",
        precio_unitario: 68000,
        unidad_medida: "m2",
        imagen_url: "https://images.unsplash.com/photo-1615529328331-f8917597711b?q=80&w=300",
        descripcion: "Textura moderna para resaltar paredes de duchas.",
        stock_actual: 50
    },
    {
        nombre: "Pintura Lavable Gris Niebla",
        categoria: "Pinturas",
        precio_unitario: 12000,
        unidad_medida: "m2",
        imagen_url: "https://images.unsplash.com/photo-1562619425-c307bb83bc42?q=80&w=300",
        descripcion: "Pintura de alta resistencia, acabado mate.",
        stock_actual: 200
    },
    {
        nombre: "Grifería Monocontrol Negra",
        categoria: "Baños",
        precio_unitario: 185000,
        unidad_medida: "unidad",
        imagen_url: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?q=80&w=300",
        descripcion: "Grifería de lujo con acabado negro mate.",
        stock_actual: 15
    }
];

const sembrarDatos = async () => {
    try {
        console.log("⏳ Conectando con Supabase Cloud...");

        // 2. Limpiar inventario antiguo (SQL equivalente a deleteMany)
        // El .neq('id', 0) es un truco para decir "borra todos los que tengan un id distinto a 0"
        const { error: deleteError } = await supabase
            .from('catalogo_materiales')
            .delete()
            .neq('id', 0);

        if (deleteError) throw deleteError;
        console.log("🧹 Tabla de materiales limpiada.");

        // 3. Insertar nuevos materiales
        const { data, error: insertError } = await supabase
            .from('catalogo_materiales')
            .insert(materialesEjemplo);

        if (insertError) throw insertError;

        console.log("✅ ¡Catálogo de Remodela-IA sembrado con éxito en la nube!");
        process.exit(0);
        
    } catch (error) {
        console.error("❌ Error crítico al sembrar datos en Supabase:", error.message);
        process.exit(1);
    }
};

sembrarDatos();
