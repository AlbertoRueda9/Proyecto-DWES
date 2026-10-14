import express from 'express';

import {
    obtenerPlazasRestantes,
    estaInscrito,
    validarInscripcion
} from './funciones.js';

const app = express();
const PORT = 3000;


// Datos de los talleres
const talleres = [
    {
        id: 1,
        titulo: 'Introducción a Docker',
        categoria: 'sistemas',
        plazas: 20,
        nivel: 'inicial'
    },
    {
        id: 2,
        titulo: 'Desarrollo de aplicaciones web',
        categoria: 'web',
        plazas: 15,
        nivel: 'intermedio'
    },
    {
        id: 3,
        titulo: 'Ciberseguridad avanzada',
        categoria: 'seguridad',
        plazas: 10,
        nivel: 'avanzado'
    }
];


// Datos de las inscripciones
const inscripciones = [
    {
        id: 1,
        tallerId: 1,
        nombre: 'Curro Ximénez',
        email: 'currox@example.com'
    },
    {
        id: 2,
        tallerId: 2,
        nombre: 'Ana López',
        email: 'ana@example.com'
    },
    {
        id: 3,
        tallerId: 1,
        nombre: 'Luis García',
        email: 'luis@example.com'
    }
];


// Configuración de EJS
app.set('view engine', 'ejs');
app.set('views', 'views');


// Middleware para recibir datos de formularios
app.use(express.urlencoded({ extended: true }));


// Ruta de prueba
app.get('/', (req, res) => {
    res.send('Servidor de inscripción a talleres funcionando');
});


// LISTADO DE TALLERES
app.get('/talleres', (req, res) => {
    const categoria = String(req.query.categoria ?? '').trim().toLowerCase();
    const nivel = String(req.query.nivel ?? '').trim().toLowerCase();
    const disponibles = req.query.disponibles;

    let resultado = talleres;

    if (categoria !== '') {
        resultado = resultado.filter(
            (taller) => taller.categoria.toLowerCase() === categoria
        );
    }

    if (nivel !== '') {
        resultado = resultado.filter(
            (taller) => taller.nivel.toLowerCase() === nivel
        );
    }

    if (disponibles === 'true') {
        resultado = resultado.filter(
            (taller) =>
                obtenerPlazasRestantes(taller, inscripciones) > 0
        );
    }

    if (disponibles === 'false') {
        resultado = resultado.filter(
            (taller) =>
                obtenerPlazasRestantes(taller, inscripciones) === 0
        );
    }

    const talleresConPlazas = resultado.map((taller) => ({
        ...taller,
        plazasRestantes: obtenerPlazasRestantes(
            taller,
            inscripciones
        )
    }));

    res.render('talleres', {
        talleres: talleresConPlazas,
        categoria,
        nivel,
        disponibles
    });
});


// FICHA DE UN TALLER
app.get('/talleres/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send('Identificador no válido');
    }

    const taller = talleres.find(
        (taller) => taller.id === id
    );

    if (!taller) {
        return res.status(404).send('Taller no encontrado');
    }

    const plazasRestantes = obtenerPlazasRestantes(
        taller,
        inscripciones
    );

    let estado;

    if (plazasRestantes === 0) {
        estado = 'Completo';
    } else if (plazasRestantes === 1) {
        estado = 'Última plaza disponible';
    } else {
        estado = `${plazasRestantes} plazas disponibles`;
    }

    res.render('detalle', {
        taller,
        plazasRestantes,
        estado
    });
});


// FORMULARIO DE INSCRIPCIÓN
app.get('/talleres/:id/inscripcion', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send('Identificador no válido');
    }

    const taller = talleres.find(
        (taller) => taller.id === id
    );

    if (!taller) {
        return res.status(404).send('Taller no encontrado');
    }

    const plazasRestantes = obtenerPlazasRestantes(
        taller,
        inscripciones
    );

    if (plazasRestantes <= 0) {
        return res.status(409).send('El taller está completo');
    }

    res.render('inscripcion', {
        taller,
        errores: {},
        datos: {
            nombre: '',
            email: ''
        }
    });
});

app.post('/talleres/:id/inscripcion', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return res.status(400).send('Identificador no válido');
    }

    const taller = talleres.find(
        (taller) => taller.id === id
    );

    if (!taller) {
        return res.status(404).send('Taller no encontrado');
    }

    const datos = {
        nombre: String(req.body.nombre ?? '').trim(),
        email: String(req.body.email ?? '').trim()
    };

    const errores = validarInscripcion(datos);

    if (Object.keys(errores).length > 0) {
        return res.status(400).render('inscripcion', {
            taller,
            errores,
            datos
        });
    }

    const plazasRestantes = obtenerPlazasRestantes(
        taller,
        inscripciones
    );

    if (plazasRestantes <= 0) {
        return res.status(409).send('El taller está completo');
    }

    if (estaInscrito(taller.id, datos.email, inscripciones)) {
        return res.status(409).send(
            'Este correo ya está inscrito en este taller'
        );
    }

    const nuevaInscripcion = {
        id: inscripciones.length + 1,
        tallerId: taller.id,
        nombre: datos.nombre,
        email: datos.email
    };

    inscripciones.push(nuevaInscripcion);

    res.redirect(`/talleres/${taller.id}`);
});


// Iniciar el servidor
app.listen(PORT, () => {
    console.log(
        `Servidor funcionando en http://localhost:${PORT}`
    );
});