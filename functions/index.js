const { onCall, HttpsError } = require("firebase-functions/v2/https");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

exports.analizarConSophia = onCall({ cors: true }, async (request) => {
    if (!request.auth) {
        throw new HttpsError('unauthenticated', 'Debes iniciar sesión para usar Sophia IA.');
    }

    const textoObservaciones = request.data.texto;
    if (!textoObservaciones || textoObservaciones.trim() === "") {
        return {
            perfil: "Línea de Enfoque Básica",
            detalle: "Sin observaciones registradas. Interfaz adaptativa estándar activa."
        };
    }

    const prompt = `
Eres Sophia, un especialista en Ingeniería Pedagógica y Adaptación Neurodivergente para educación básica y secundaria.
Analiza la siguiente descripción de un estudiante proporcionada por padres o docentes.

Debes responder ÚNICAMENTE en formato JSON estrictamente válido, con esta estructura:
{
  "perfil": "Título corto del perfil adaptativo (Ej: Soporte TDAH / Enfoque Fragmentado, Soporte Dislexia / Regleta Visual, Soporte TEA / Procesamiento Literal, etc.)",
  "detalle": "Explicación de 2 o 3 oraciones sobre las estrategias concretas que Sophia aplicará en la interfaz para adaptar las actividades de este alumno."
}

Observaciones del alumno:
"${textoObservaciones}"
`;

    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const result = await model.generateContent(prompt);
        return JSON.parse(result.response.text());

    } catch (error) {
        console.error("Error en Sophia IA:", error);
        throw new HttpsError('internal', 'Error procesando la IA: ' + error.message);
    }
});
