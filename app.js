document.addEventListener('DOMContentLoaded', () => {
    const btnMaestro = document.getElementById('btn-maestro');
    const btnAlumno = document.getElementById('btn-alumno');
    const btnGoogle = document.getElementById('btn-google');

    btnMaestro.addEventListener('click', () => {
        alert('Cargando el espacio seguro para Profesores...');
    });

    btnAlumno.addEventListener('click', () => {
        alert('Abriendo el acceso con código para Alumnos...');
    });

    btnGoogle.addEventListener('click', () => {
        alert('Iniciando sesión con Google mediante Firebase...');
    });
});
