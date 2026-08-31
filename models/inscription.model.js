const { supabase } = require("../lib/supabaseClient");

async function joinTournament(torneo_id, usuario_id) {
    return await supabase.from("inscripciones").insert({
        torneo_id: torneo_id,
        usuario_id: usuario_id,
        slot: Date.now() % 1000000,

    })
}

async function leaveTournament(torneo_id, usuario_id) {
    return await supabase
        .from("inscripciones")
        .delete()
        .eq("torneo_id", torneo_id,)
        .eq("usuario_id", usuario_id,)
}

async function getUserinscriptions(usuario_id) {
    return await supabase
    .from("inscripciones")
    .select("torneo_id")
    .eq("usuario_id", usuario_id)
}

module.exports = {
    joinTournament,
    leaveTournament,
    getUserinscriptions
}