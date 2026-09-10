const { supabase } = require("../lib/supabaseClient")


async function obtenerAmistosos() {
    const margenMs = 20 * 60 * 1000;
    const fechaCorte = new Date(Date.now() - margenMs);

    return await supabase
        .from("amistosos")
        .select("*")
        .gte("fecha", fechaCorte.toISOString())
}

async function obtenerModos() {
    return await supabase
        .from("modos_amistoso")
        .select("*")
}

async function crearAmistoso(datos) {
    return await supabase
        .from("amistosos")
        .insert(datos)
        .select()
}

async function obtenerAmistosoPorId(friendlyId) {
    return await supabase
        .from("amistosos")
        .select("*")
        .eq("id", friendlyId)
}

async function eliminarAmistoso(friendlyId) {
    return await supabase
        .from("amistosos")
        .delete()
        .eq("id", friendlyId)
}

async function actualizarNumeroSala(amistoso_id, numero_sala) {
    return await supabase
    .from("amistosos")
    .update({ numero_sala })
    .eq("id", amistoso_id)
}

module.exports = {
    obtenerAmistosos,
    obtenerModos,
    crearAmistoso,
    obtenerAmistosoPorId,
    eliminarAmistoso,
    actualizarNumeroSala
}