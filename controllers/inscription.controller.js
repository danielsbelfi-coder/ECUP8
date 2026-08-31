const { messages } = require("../lib/messages");
const { joinTournament, leaveTournament } = require("../models/inscription.model");


async function join(req, res) {
    try {
        if (!req.session.user) {
            throw new Error("require_login_join");
        }

        const { data, error } = await joinTournament(req.params.id, req.session.user.id)

        if (error) {
            if (error.code === "23505") {
                throw new Error("already_logged")
            }
            throw new Error(error.message)
        }

        res.redirect("/?flash=join_success")

    } catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        res.redirect("/?flash=" + code);
    }
}

async function leave(req, res) {
    try {
        if (!req.session.user) {
            throw new Error("require_login_to_left");
        }

        const { data, error } = await leaveTournament(req.params.id, req.session.user.id)

        if (error) {
            throw new Error(error.message)
        }

        res.redirect("/?flash=left_success")

    } catch (error) {
        const code = messages[error.message] ? error.message : "unknown_error"
        res.redirect("/?flash=" + code);
    }
}



module.exports = {
    join,
    leave,
}