const express = require("express");
const { join, leave } = require("../controllers/inscription.controller");
const { verificarToken } = require("../middlewares/csrf.middleware");
const router = express.Router()


router.post("/torneos/:id/unirse", verificarToken, join)
router.post("/torneos/:id/salir", verificarToken, leave)

module.exports = router