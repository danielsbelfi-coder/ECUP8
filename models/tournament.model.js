const { supabase } = require("../lib/supabaseClient");


async function obtenerTorneos() {
    const margenMs = 20 * 60 * 1000;
    const fechaCorte = new Date(Date.now() - margenMs);

    return await supabase
        .from("torneos")
        .select("*")
        .gte("fecha", fechaCorte.toISOString())
}

async function crearTorneo(datos) {
    return await supabase
    .from("torneos")
    .insert(datos)
    .select()
}

async function eliminarTorneo(torneo_id) {
    return await supabase
    .from("torneos")
    .delete()
    .eq("id", torneo_id)
}

async function obtenerTorneoPorId(torneo_id) {
    return await supabase
    .from("torneos")
    .select("*")
    .eq("id", torneo_id)    
}

module.exports = { 
    obtenerTorneos,
    crearTorneo,
    eliminarTorneo,
    obtenerTorneoPorId
}