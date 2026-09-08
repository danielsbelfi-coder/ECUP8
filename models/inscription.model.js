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

async function getUserFriendlyInscriptions(usuario_id) {
    return await supabase
        .from("inscripciones_amistoso")
        .select("amistoso_id")
        .eq("usuario_id", usuario_id)
}

async function contarInscritos(torneo_id) {
    return await supabase
        .from("inscripciones")
        .select("*", { count: "exact", head: true })
        .eq("torneo_id", torneo_id);
}

async function joinFriendly(amistoso_id, usuario_id, id_jugador) {
    return await supabase.from("inscripciones_amistoso").insert({
        amistoso_id,
        usuario_id,
        id_jugador
    })
}

async function getAllFriendlyInscriptions() {
    return await supabase
        .from("inscripciones_amistoso")
        .select("amistoso_id")

}

async function leaveFriendly(amistoso_id, usuario_id) {
    return await supabase
    .from("inscripciones_amistoso")
    .delete()
    .eq("amistoso_id", amistoso_id)
    .eq("usuario_id", usuario_id)
}

async function countFriendlySingups(amistoso_id) {
    return await supabase
        .from("inscripciones_amistoso")
        .select("*", { count: "exact", head: true })
        .eq("amistoso_id", amistoso_id);
}

module.exports = {
    joinTournament,
    leaveTournament,
    getUserinscriptions,
    contarInscritos,
    joinFriendly,
    getUserFriendlyInscriptions,
    getAllFriendlyInscriptions,
    leaveFriendly,
    countFriendlySingups
}