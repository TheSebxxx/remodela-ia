const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

async function check() {
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    // Este comando le pregunta a Google: "¿Qué modelos puedo usar?"
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    
    console.log("--- MODELOS DISPONIBLES EN TU CUENTA ---");
    data.models.forEach(m => console.log("- " + m.name));
}

check().catch(console.error);