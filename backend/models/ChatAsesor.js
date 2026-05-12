// backend/models/ChatAsesor.js
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

class ChatAsesor {
    constructor() {
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
        // Usamos el modelo flash para respuestas rápidas y económicas
        this.model = genAI.getGenerativeModel({ 
            model: "gemini-flash-latest" 
        });

        this.contextoBase = `Eres el asesor experto de Remodela-IA. Tu estilo es moderno, inspirador y profesional.
      
REGLAS DE ORO:
1. NUNCA lances precios en el primer mensaje. Primero valida la visión del cliente.
2. Si el cliente dice qué quiere remodelar (ej. cocina), interésate por el estilo (¿moderno, industrial, rústico?).
3. Da recomendaciones de diseño breves (ej. "Para cocinas pequeñas, el blanco da amplitud").
4. Solo cuando tengas los m2, ofrece un presupuesto basado en el INVENTARIO.
5. Usa un tono cercano (ej. "¡Excelente elección!", "Esa medida es perfecta").

ESTRUCTURA DE RESPUESTA:
- Empatía/Validación + Recomendación de diseño + Pregunta estratégica (estilo o medidas).`;

    }

    

    async generarRespuesta(promptConContexto) {
        try {
            // Verificamos que el prompt no llegue vacío
            if (!promptConContexto) throw new Error("El prompt está vacío");

            const result = await this.model.generateContent(promptConContexto);
            const response = await result.response;
            const texto = response.text();
            
            return texto;
        } catch (error) {
            // Log detallado en la terminal para que Johan lo vea
            console.error(" Error crítico en ChatAsesor:", error.message);
            
            // Si el error es por la API KEY, lo avisamos en la consola
            if (error.message.includes("API key")) {
                console.error("--- ¡REVISAR GEMINI_API_KEY EN EL ARCHIVO .ENV! ---");
            }

            return "Lo siento, Mariana, tengo un problema técnico para conectar con mi cerebro de IA. ¿Podemos intentar de nuevo en un momento?";
        }
    }
}

// Exportamos una instancia única para que el controlador la use
module.exports = new ChatAsesor();