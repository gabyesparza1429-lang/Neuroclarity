const functions = require("firebase-functions");
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = process.env.GEMINI_API_KEY || (functions.config().gemini ? functions.config().gemini.key : "");
const genAI = new GoogleGenerativeAI(apiKey);

exports.sofia = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
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
exports.generarKitAdaptado = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
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


// Motor de Generación de Materiales Pedagógicos Sofía IA
exports.generarMaterialesSofia = functions.https.onRequest(async (req, res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    if (req.method === 'OPTIONS') {
        res.status(204).send('');
        return;
    }
    
    const { materia, tema, neurodivergencia } = req.body || {};
    const temaActivo = tema || 'Historia: Revolución Mexicana';
    const perfil = neurodivergencia || 'TDAH / Dislexia';

    const kitGenerado = {
        materia: materia || 'Historia',
        tema: temaActivo,
        perfilAdaptacion: perfil,
        fecha: new Date().toLocaleDateString(),
        materiales: {
            flashcards: [
                { concepto: '1910', definicion: 'Inicio de la Revolución Mexicana liderada por Madero.' },
                { concepto: 'Porfirio Díaz', definicion: 'Presidente que estuvo en el poder por más de 30 años.' },
                { concepto: 'Emiliano Zapata', definicion: 'Líder del movimiento agrario: Tierra y Libertad.' }
            ],
            quiz: [
                {
                    pregunta: '¿En qué año inició la Revolución Mexicana?',
                    opciones: ['1910', '1810', '1920'],
                    correcta: 0,
                    explicacion: 'Inició el 20 de noviembre de 1910.'
                },
                {
                    pregunta: '¿Cuál era el lema de Emiliano Zapata?',
                    opciones: ['Sufragio efectivo', 'Tierra y Libertad', 'Patria o Muerte'],
                    correcta: 1,
                    explicacion: 'Zapata defendía la devolución de tierras a los campesinos.'
                }
            ],
            cornell: {
                ideasClave: ['Causas socioeconómicas', 'Personajes clave', 'Consecuencias'],
                notasPrincipales: 'Descontento social por la dictadura de Porfirio Díaz. Surgimiento de líderes regionales.',
                resumen: 'Movimiento armado de 1910 que buscaba la justicia social, reforma agraria y democracia.'
            },
            presentacion: [
                { titulo: 'Portada', contenido: temaActivo },
                { titulo: 'Antecedentes', contenido: 'El Porfiriato y la desigualdad social.' },
                { titulo: 'El Conflicto', contenido: 'Levantamiento armado de 1910.' }
            ]
        }
    };

    // Configuración API Canva (Opción B: Crear diseño dinámico sin plantilla)
    const clientId = process.env.CANVA_CLIENT_ID || 'OC-AZ_EfP1_ymzW';
    const clientSecret = process.env.CANVA_CLIENT_SECRET;

    let urlCanvaPresentacion = "https://www.canva.com/design/DAGzQxv3af8/view?embed";

    try {
        // 1. Obtener Token de acceso de la API de Canva
        const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
        const tokenResponse = await fetch('https://api.canva.com/v1/oauth/token', {
            method: 'POST',
            headers: {
                'Authorization': `Basic ${authHeader}`,
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                grant_type: 'client_credentials',
                scope: 'design:content:read design:meta:read'
            })
        });

        const tokenData = await tokenResponse.json();

        if (tokenData.access_token) {
            // 2. Crear diseño de presentación en blanco vía API
            const designResponse = await fetch('https://api.canva.com/v1/designs', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${tokenData.access_token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    design_type: "presentation",
                    title: `Material: ${temaActivo}`
                })
            });

            const designData = await designResponse.json();

            if (designData.design && designData.design.urls && designData.design.urls.edit_url) {
                // Convertir la URL devuelta por Canva a formato embed público
                const designId = designData.design.id;
                urlCanvaPresentacion = `https://www.canva.com/design/${designId}/view?embed`;
            }
        }
    } catch (errApi) {
        console.error("Error al conectar con la API de Canva:", errApi);
    }

    res.json({ 
        status: 'success', 
        urlCanva: urlCanvaPresentacion,
        kit: kitGenerado 
    });
});
