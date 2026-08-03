const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || (functions.config().gemini ? functions.config().gemini.key : "");
const genAI = new GoogleGenerativeAI(apiKey);

exports.sofia = functions.https.onRequest(async (req, res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") {
        res.status(204).send("");
        return;
    }

    try {
        const prompt = req.body.prompt || "Hola Sofía";
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        res.json({ respuesta: text });
    } catch (error) {
        console.error("Error en Sofía:", error);
        res.status(500).json({ respuesta: "Sofía está recalibrando sus servicios. Intenta nuevamente en un momento." });
    }
});


// Función para generar Kit de Canva adaptado a Neurodiversidad
exports.generarKitAdaptado = onRequest(async (req, res) => {
    const { alumnoId, tema, neurodivergencia } = req.body;
    
    // Asignación de formato según perfil cognitivo
    let estiloInfografia = 'cornell_estándar';
    if (neurodivergencia === 'Dislexia') {
        estiloInfografia = 'cornell_fuente_lectura_facil';
    } else if (neurodivergencia === 'TDAH') {
        estiloInfografia = 'mapa_visual_alto_contraste';
    }

    const kit = {
        tema: tema,
        perfil: neurodivergencia || 'General',
        materiales: [
            { tipo: 'presentacion', nombre: 'Presentación Interactiva: ' + tema },
            { tipo: 'flashcards', nombre: 'Tarjetas de Memoria: ' + tema },
            { tipo: 'quiz', nombre: 'Cuestionario Interactivo: ' + tema },
            { tipo: 'infografia', nombre: 'Apuntes ' + estiloInfografia + ': ' + tema }
        ]
    };

    res.json({ status: 'success', kit: kit });
});
