const { messages } = require("../lib/messages");
const { obtenerAmistosos, obtenerModos, crearAmistoso, obtenerAmistosoPorId, eliminarAmistoso, actualizarNumeroSala } = require("../models/friendly.model");
const { joinFriendly, getUserFriendlyInscriptions, getAllFriendlyInscriptions } = require("../models/inscription.model");

async function listarAmistosos(req, res) {
    try {
        const { data, error } = await obtenerAmistosos();
        if (error) {
            throw new Error(error.message);
        }

        const { data: modos, error: errorModos } = await obtenerModos();
        if (errorModos) {
            throw new Error(errorModos.message)
        }
        let idsInscritos = []

        if (req.session.user) {
            const { data: inscripciones, error: errorInscripciones } = await getUserFriendlyInscriptions(req.session.user.id);
            if (errorInscripciones) {
                throw new Error(errorInscripciones.message);
            }
            idsInscritos = inscripciones.map((inscripcion) => inscripcion.amistoso_id)
        }

        const conteos = {}

        const { data: todasLasInscripciones, error: errorTodas } = await getAllFriendlyInscriptions();

        if (errorTodas) {
            throw new Error(errorTodas.message)
        }

        todasLasInscripciones.forEach((inscripcion) => {
            const id = inscripcion.amistoso_id;
            conteos[id] = (conteos[id] || 0) + 1
        })


        const friendlyWithState = data.map((friendly) => ({
            ...friendly,
            inscritos: conteos[friendly.id] || 0,
            cupoMaximo: modos.find((modo) => modo.codigo === friendly.modo_codigo).cupo,
            yaInscrito: idsInscritos.includes(friendly.id),
            yaComenzo: new Date(friendly.fecha) < new Date(),
            esHost: req.session.user && friendly.host_id === req.session.user.id,
            
            numero_sala: (idsInscritos.includes(friendly.id) || (req.session.user && friendly.host_id === req.session.user.id))
                ? friendly.numero_sala
                : null,

            link_coordinacion: (idsInscritos.includes(friendly.id) || (req.session.user && friendly.host_id === req.session.user.id))
                ? friendly.link_coordinacion
                : null,

            fechaFormateada: new Date(friendly.fecha)
                .toLocaleString("es-CL", {
                    day: "2-digit",
                    month: "long",
                    hour: "2-digit",
                    minute: "2-digit"
                }
                )
        }))

        const formData = req.session.formData || {};
        req.session.formData = null

        res.render("amistosos", {
            rutaActual: req.path,
            amistosos: friendlyWithState,
            user: req.session.user,
            idsInscritos,
            modos: modos,
            formData
        });

    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Hubo un error en el servidor"
        });
    }
}

async function crear(req, res) {
    try {
        const { id_jugador, modo_codigo, tipo_equipo, region, fecha, hora, link_coordinacion, numero_sala } = req.body;

        if (!req.session.user) {
            throw new Error("require_login_create");
        }

        if (!id_jugador || !modo_codigo || !tipo_equipo || !region || !fecha || !hora || !link_coordinacion) {
            throw new Error("require_friendly_data")
        }

        const fechaCompleta = new Date(`${fecha}T${hora}`)

        if (fechaCompleta < new Date())
            throw new Error("expired_date")

        const soloNumeros = /^[0-9]+$/;
        let linkFinal;

        if (soloNumeros.test(link_coordinacion)) {
            linkFinal = `https://wa.me/${link_coordinacion}`
        } else if (link_coordinacion.startsWith("http")) {
            linkFinal = link_coordinacion
        } else {
            linkFinal = `https://${link_coordinacion}`
        }

        const nombreSala = `Sala de ${id_jugador}`;

        const { data, error } = await crearAmistoso({
            nombre: nombreSala,
            modo_codigo,
            tipo_equipo,
            numero_sala,
            fecha: fechaCompleta,
            link_coordinacion: linkFinal,
            region,
            host_id: req.session.user.id
        })

        if (error) {
            throw new Error(error.message)
        }

        const friendlyId = data[0].id
        const { data: inscripcion, error: errorJoin } = await joinFriendly(
            friendlyId,
            req.session.user.id,
            id_jugador
        )

        if (errorJoin) {
            throw new Error(errorJoin.message)
        }

        res.redirect("/amistosos?flash=friendly_created")

    } catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        req.session.formData = req.body
        res.redirect("/amistosos?flash=" + code);
    }
}

async function eliminar(req, res) {
    try {
        const { data, error } = await obtenerAmistosoPorId(req.params.id)

        if (!req.session.user) {
            throw new Error("require_login_to_delete")
        }
        if (error) {
            throw new Error(error.message)
        }
        if (data[0].host_id !== req.session.user.id) {
            throw new Error("require_permissions_to_delete")
        }

        const { data: resultado, error: errorEliminar } = await eliminarAmistoso(req.params.id)
        if (errorEliminar) {
            throw new Error(errorEliminar.message)
        }
        res.redirect("/amistosos?flash=delete_tournament_success")
    }
    catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        res.redirect("/amistosos?flash=" + code)
    }
}

async function actualizarSala(req, res) {
    try {
        const { numero_sala } = req.body;

        const { data, error } = await obtenerAmistosoPorId(req.params.id)

        if (!req.session.user) {
            throw new Error("require_login_to_edit")
        }

        if (error) {
            throw new Error(error.message)
        }

        if (data[0].host_id !== req.session.user.id) {
            throw new Error("require_permissions_to_delete")
        }

        const { data: resultado, error: errorEditar } = await actualizarNumeroSala(req.params.id, numero_sala)

        if (errorEditar) {
            throw new Error(errorEditar.message)
        }

        res.redirect("/amistosos?flash=edit_success")

    } catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        res.redirect("/amistosos?flash=" + code)
    }
}

module.exports = {
    listarAmistosos,
    crear,
    eliminar,
    actualizarSala
};