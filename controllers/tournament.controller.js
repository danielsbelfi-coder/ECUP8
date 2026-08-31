const { messages } = require("../lib/messages");
const { getUserinscriptions, joinTournament } = require("../models/inscription.model");
const { obtenerTorneos, crearTorneo, eliminarTorneo, obtenerTorneoPorId } = require("../models/tournament.model")


async function listar(req, res) {
    try {
        const { data, error } = await obtenerTorneos();
        if (error) {
            throw new Error(error.message);
        }
        let idsInscritos = [];

        if (req.session.user) {
            const { data: inscripciones, error: errorInscripciones } = await getUserinscriptions(req.session.user.id);
            if (errorInscripciones) {
                throw new Error(errorInscripciones.message)
            }
            idsInscritos = inscripciones.map((inscription) => inscription.torneo_id)
        }

        const tournamentWithState = data.map((torneo) => ({
            ...torneo,
            yaInscrito: idsInscritos.includes(torneo.id),
            esHost: req.session.user && torneo.host_id === req.session.user.id,
            link_coordinacion: (idsInscritos.includes(torneo.id) || (req.session.user && torneo.host_id === req.session.user.id))
                ? torneo.link_coordinacion
                : null,
            fechaFormateada: new Date(torneo.fecha)
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

        res.render("home", {
            torneos: tournamentWithState,
            user: req.session.user,
            idsInscritos,
            formData,
        })
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "Hubo un error en el servidor"
        })
    }
}

async function crear(req, res) {
    try {
        const { nombre, fecha, hora, max_jugadores, link_coordinacion, region } = req.body;

        if (!req.session.user) {
            throw new Error("require_login_create");
        }

        if (!nombre || !fecha || !hora || !max_jugadores || !link_coordinacion || !region) {
            throw new Error("require_tournament_data")
        }

        const fechaCompleta = new Date(`${fecha}T${hora}`)

        if (fechaCompleta < new Date())
            throw new Error("expired_date")

        if (Number(max_jugadores) < 4 || Number(max_jugadores) > 8)
            throw new Error("min_max_players")

        if (Number(max_jugadores) % 2 !== 0)
            throw new Error("pair_condition")

        const soloNumeros = /^[0-9]+$/;
        let linkFinal;

        if (soloNumeros.test(link_coordinacion)) {
            linkFinal = `https://wa.me/${link_coordinacion}`
        } else if (link_coordinacion.startsWith("http")) {
            linkFinal = link_coordinacion
        } else {
            linkFinal = `https://${link_coordinacion}`
        }

        const { data, error } = await crearTorneo({
            nombre,
            fecha: fechaCompleta,
            max_jugadores: Number(max_jugadores),
            link_coordinacion: linkFinal,
            region,
            host_id: req.session.user.id,
        })

        if (error) {
            throw new Error(error.message)
        }

        const torneoId = data[0].id
        const { data: inscripcion, error: errorJoin } = await joinTournament(
            torneoId,
            req.session.user.id
        )

        if (errorJoin) {
            throw new Error(errorJoin.message)
        }

                res.redirect("/?flash=created_tournament")

    } catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        req.session.formData = req.body
        res.redirect("/?flash=" + code);
    }
}

async function eliminar(req, res) {
    try {
        const { data, error } = await obtenerTorneoPorId(req.params.id)

        if (!req.session.user) {
            throw new Error("require_login_to_delete");
        }
        if (error) {
            throw new Error(error.message)
        }
        if (data[0].host_id !== req.session.user.id) {
            throw new Error("require_permissions_to_delete")
        }

        const { data: resultado, error: errorEliminar } = await eliminarTorneo(req.params.id)
        if (errorEliminar) {
            throw new Error(errorEliminar.message)
        }

        res.redirect("/?flash=delete_tournament_success")

    } catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        res.redirect("/?flash=" + code);
    }

}

module.exports = {
    listar,
    crear,
    eliminar,
};