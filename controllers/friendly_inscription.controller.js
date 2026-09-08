const { messages } = require("../lib/messages");
const { obtenerAmistosoPorId, obtenerModos } = require("../models/friendly.model");
const { leaveFriendly, countFriendlySingups, joinFriendly } = require("../models/inscription.model");


async function leave(req, res) {
    try {
        if (!req.session.user) {
            throw new Error("require_login_to_left");
        }

        const { data, error } = await leaveFriendly(req.params.id, req.session.user.id)

        if (error) {
            throw new Error(error.message)
        }
        res.redirect("/amistosos?flash=left_success")
    } catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        res.redirect("/amistosos?flash=" + code)
    }
}

async function join(req, res) {
    try {
        if (!req.session.user) {
            throw new Error("require_login_join")
        }

        const { id_jugador } = req.body;

        if (!id_jugador) {
            throw new Error("require_friendly_data")
        }

        const { data: friendly, error: errorFriendly } = await obtenerAmistosoPorId(req.params.id)
        if (errorFriendly) {
            throw new Error(errorFriendly.message)
        }

        const { data: modos } = await obtenerModos();
        const modoDelAmistoso = modos.find((modo) => modo.codigo === friendly[0].modo_codigo);

        const { count } = await countFriendlySingups(req.params.id);
        if (count >= modoDelAmistoso.cupo) {
            throw new Error("friendly_full")
        }

        const { data, error } = await joinFriendly(req.params.id, req.session.user.id, id_jugador)

        if (error) {
            if (error.code === "23505") {
                throw new Error("already_logged")
            }
            throw new Error(error.message)
        }
        
        res.redirect("/amistosos?flash=join_success")

    } catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        res.redirect("/amistosos?flash=" + code);
    }

}

module.exports = {
    join,
    leave
}