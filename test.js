// test.js (ubicado en la raíz o donde prefieras)
const asesor = require('./backend/models/ChatAsesor'); 
require('dotenv').config();

async function probar() {
    console.log("--- PROBANDO CONEXIÓN REMODELA-IA ---");
    try {
        // Simulamos un prompt que el controlador le enviaría
        const promptPrueba = `
        INVENTARIO:
        - Porcelanato Gris: $45.000/m2
        - Azulejo Blanco: $68.000/m2
        
        PREGUNTA: ¿Qué me recomiendas para un baño pequeño?`;

        console.log("Consultando a Gemini...");
        const respuesta = await asesor.generarRespuesta(promptPrueba);
        
        console.log("-------------------------------------");
        console.log("Respuesta de la IA:", respuesta);
        console.log("-------------------------------------");
    } catch (error) {
        console.error("❌ Error en la prueba:", error.message);
    }
}

probar();
