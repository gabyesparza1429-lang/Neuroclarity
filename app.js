// Importaciones compatibles con el navegador (CDN)
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-analytics.js";
// Agregamos la importación requerida para usar la base de datos de Firestore
import { getFirestore, doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// La configuración de tu aplicación web de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-uxzwCNpLvMUMUjm0FcoOWsX2wOzOFBE",
  authDomain: "neuroclarity-dcf0e.firebaseapp.com",
  projectId: "neuroclarity-dcf0e",
  storageBucket: "neuroclarity-dcf0e.firebasestorage.app",
  messagingSenderId: "34116345239",
  appId: "1:34116345239:web:0bd6a7484a7f2ff081f8d2",
  measurementId: "G-1C875WNG8X"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Inicializar base de datos
const db = getFirestore(app);

/**
 * Conecta el texto del profesor con el diagnóstico guardado del alumno y llama a Sophia (IA)
 * @param {string} idAlumno - ID único del estudiante
 * @param {string} textoOriginal - El material o lectura que subió el docente
 * @param {string} materia - Asignatura correspondiente
 */
export async function generarAgendaConSophia(idAlumno, textoOriginal, materia) {
    try {
        // 1. Extraer o crear el expediente del alumno en Firestore si aún no existe
        const alumnoRef = doc(db, "alumnos", idAlumno);
        let alumnoSnap = await getDoc(alumnoRef);

        if (!alumnoSnap.exists()) {
            console.log(`[Sophia] Expediente no encontrado para ${idAlumno}. Creando expediente por defecto...`);
            await setDoc(alumnoRef, {
                id: idAlumno,
                nombre: idAlumno,
                linea_enfoque: "Adaptativo",
                grupo: "General",
                matriz_dsm5: { atencion: "alta", procesamiento_visual: "grafico", tiempo_flexible: true },
                fecha_registro: new Date().toISOString().split('T')[0]
            }, { merge: true });
            alumnoSnap = await getDoc(alumnoRef);
        }

        const datosAlumno = alumnoSnap.data();
        const matrizClinica = datosAlumno.matriz_dsm5 || {};
        const lineaPrincipal = datosAlumno.linea_enfoque || "Adaptativo";

        console.log(`[Sophia] Cargando radiografía clínica. Perfil dominancia: ${lineaPrincipal}`);

        // 2. Estructura de instrucciones para enviar los datos reales a la IA
        const instruccionesSophia = {
            identidad: "Eminencia en Neurología cognitiva y Pedagogía clínica especializada en neurodivergencias.",
            tarea: "Aplicar la Taxonomía de Bloom para fragmentar el texto original en 4 bloques (Activación, Diagnóstico, Sistematización, Evaluación).",
            regla_oro: "Adaptar el diseño y la redacción usando los puntajes detallados del DSM-5 provistos para este alumno.",
            datos_alumno: matrizClinica,
            texto_profesor: textoOriginal
        };

        console.log("Datos listos para enviar a la API de Gemini...", instruccionesSophia);

        // 3. Estructura del JSON esperado que guardará Sophia en la agenda diaria
        const agendaAdaptada = {
            id_alumno: idAlumno,
            materia: materia,
            fecha_creacion: new Date().toISOString().split('T')[0],
            bloques_bloom: {
                activacion: "Contenido inicial adaptado.",
                diagnostico: { pregunta: "Pregunta previa", opciones: [], correcta: 0 },
                sistematizacion: "Texto del profesor estructurado para sus necesidades.",
                evaluacion_final: { pregunta: "Pregunta de cierre", opciones: [], correcta: 0 }
            }
        };

        // 4. Guardar en Firestore
        const agendaRef = doc(db, "agendas_diarias", `${idAlumno}_${materia}`);
        await setDoc(agendaRef, agendaAdaptada);

        console.log("[Sophia] Agenda diaria guardada con éxito.");
        return true;

    } catch (error) {
        console.error("Error en el motor de app.js:", error);
        return false;
    }
}
export async function guardarAlumnoEnFirestore(idAlumno, nombre, lineaEnfoque, grupo) {
    try {
        const alumnoRef = doc(db, "alumnos", idAlumno);
        await setDoc(alumnoRef, {
            id: idAlumno,
            nombre: nombre,
            linea_enfoque: lineaEnfoque,
            grupo: grupo,
            matriz_dsm5: {},
            fecha_registro: new Date().toISOString().split('T')[0]
        }, { merge: true });
        return true;
    } catch (error) {
        console.error("Error al guardar alumno desde el panel:", error);
        return false;
    }
}

// Lo exponemos globalmente para que profesor.html lo pueda invocar
window.guardarAlumnoEnFirestore = guardarAlumnoEnFirestore;
// Vinculación global
window.generarAgendaConSophia = generarAgendaConSophia;
