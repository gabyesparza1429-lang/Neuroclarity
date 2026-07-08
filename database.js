// database.js - Archivo NUEVO para centralizar la Base de Datos
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, doc, setDoc, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 1. Conexión automática con tu consola de Firebase
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:1234:web:abcd"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * SUB-ETAPA 1.1: Guardar Usuario (Inscripción y Control)
 */
async function crearUsuario(uid, email, rol) {
    try {
        await setDoc(doc(db, "usuarios", uid), {
            uid: uid,
            email: email,
            rol: rol, // 'profesor' o 'padre'
            suscripcion_activa: false, 
            fecha_registro: serverTimestamp()
        }, { merge: true });
        console.log("Colección 'usuarios' estructurada.");
    } catch (e) { console.error("Error en usuarios:", e); }
}

/**
 * SUB-ETAPA 1.2: Guardar Alumno (Perfil Pedagógico)
 */
async function crearAlumno(idAlumno, idTutor, nombre, grado, grupo) {
    try {
        await setDoc(doc(db, "alumnos", idAlumno), {
            id_alumno: idAlumno,
            id_tutor: idTutor,
            nombre: nombre,
            grado: grado,
            grupo: grupo,
            linea_enfoque: "Pendiente", // Se llenará con el Test o PDF
            diagnostico_url: "" // Enlace al PDF oficial si existe
        }, { merge: true });
        console.log("Colección 'alumnos' estructurada.");
    } catch (e) { console.error("Error en alumnos:", e); }
}

/**
 * SUB-ETAPA 1.3: Registrar Vinculación (Conexión por Código)
 */
async function crearVinculacion(codigoVinculo, idAlumno, idProfesor) {
    try {
        await setDoc(doc(db, "vinculaciones", codigoVinculo), {
            codigo_vinculo: codigoVinculo, // Ej: 'NC-8849'
            id_alumno: idAlumno,
            id_profesor: idProfesor,
            estatus: "activo" // 'activo' o 'usado'
        });
        console.log("Colección 'vinculaciones' estructurada.");
    } catch (e) { console.error("Error en vinculaciones:", e); }
}

/**
 * SUB-ETAPA 1.4: Guardar Agenda Diaria (Cero Horas Muertas y Bloom Vía IA)
 */
async function crearAgendaDiaria(idAgenda, idAlumno, fecha, materia, examenProfesor) {
    try {
        await setDoc(doc(db, "agenda_diaria", idAgenda), {
            id_agenda: idAgenda,
            id_alumno: idAlumno,
            fecha: fecha, // Formato: 'AAAA-MM-DD'
            materia: materia,
            contenido_base: examenProfesor, // Examen en bruto del docente
            bloques_bloom: {
                activacion: "Texto de repaso de 2 minutos generado por IA.",
                diagnostico: { pregunta: "¿?", opciones: [], correcta: "" },
                sistematizacion: "Lectura adaptada con micro-tareas.",
                evaluacion_final: { pregunta: "¿?", opciones: [], correcta: "" }
            },
            estatus_clase: "pendiente" // 'pendiente' o 'completada'
        });
        console.log("Colección 'agenda_diaria' estructurada.");
    } catch (e) { console.error("Error en agenda_diaria:", e); }
}

export { db, crearUsuario, crearAlumno, crearVinculacion, crearAgendaDiaria };
