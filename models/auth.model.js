const { supabase } = require("../lib/supabaseClient");


async function discordLogin(redirectTo) {
    return await supabase.auth.signInWithOAuth({
        provider: "discord",
        options: {
            redirectTo
        }
    })

}

async function changeCode (code) {
    return await supabase.auth.exchangeCodeForSession(code);
}

async function discordlogout() {
    return await supabase.auth.signOut()    
}
module.exports = {
    discordLogin,
    changeCode,
    discordlogout
}