export function obtenerPlazasRestantes(taller, inscripciones) {
    const numeroInscripciones = inscripciones.filter(
        (inscripcion) => inscripcion.tallerId === taller.id
    ).length;

    return taller.plazas - numeroInscripciones;
}

export function estaInscrito(tallerId, email, inscripciones) {
    return inscripciones.some(
        (inscripcion) =>
            inscripcion.tallerId === tallerId &&
            inscripcion.email.toLowerCase() === email.toLowerCase()
    );
}

export function validarInscripcion(datos) {
    const errores = {};

    const nombre = String(datos.nombre ?? '').trim();
    const email = String(datos.email ?? '').trim();

    if (nombre.length < 2) {
        errores.nombre = 'El nombre debe tener al menos 2 caracteres';
    }

    const formatoEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!formatoEmail.test(email)) {
        errores.email = 'Introduce un correo electrónico válido';
    }

    return errores;
}