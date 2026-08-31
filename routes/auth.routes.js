const express = require("express");
const router = express.Router();
const { login, callback, logout } = require("../controllers/auth.controller.js");
const { verificarToken } = require("../middlewares/csrf.middleware.js");


router.get("/discord", login)

router.get("/callback", callback)

router.post("/logout", verificarToken, logout)

module.exports = router