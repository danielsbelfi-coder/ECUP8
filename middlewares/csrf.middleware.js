const crypto = require("crypto");

function generarToken(req, res, next) {
    if (!req.session.csrfToken) {
        req.session.csrfToken = crypto.randomBytes(32).toString("hex");
    }
    res.locals.csrfToken = req.session.csrfToken;
    next();
}

function verificarToken(req, res, next) {
    const tokenForm = req.body._csrf;
    const tokenSesion = req.session.csrfToken;

    if (!tokenForm || tokenForm !== tokenSesion) {
        return res.status(403).send("token de seguridad inválido")
    }

    next()
}

module.exports = {
    generarToken,
    verificarToken
};