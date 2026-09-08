const { discordLogin, changeCode, discordlogout } = require("../models/auth.model");

const PORT = process.env.PORT

async function login(req, res) {
    try {
        req.session.volverA = req.query.volver || "/";
        const { data, error } = await discordLogin(`${process.env.APP_URL}/auth/callback`)

        if (error) {
            throw new Error(error.message)
        }
        res.redirect(data.url)
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "hubo un error del servidor"
        })
    }

}

async function callback(req, res) {
    try {
        const { data, error } = await changeCode(req.query.code)

        if (error) {
            throw new Error(error.message)
        }
        req.session.user = data.session.user
        const destino = req.session.volverA || "/";
        res.redirect(destino);


    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "hubo un error del servidor"
        })
    }
}

async function logout(req, res) {
    try {
        const { data, error} = await discordlogout()
        
        if (error) {
            throw new Error(error.message)
        }
        req.session.user = null
        res.redirect("/")
    } catch (error) {
        res.status(500).json({
            ok: false,
            message: "hubo un error del servidor"
        })
    }    
}

module.exports = {
    login,
    callback,
    logout
}