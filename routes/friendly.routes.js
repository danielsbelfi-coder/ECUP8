const express = require("express")
const router = express.Router()
const { listarAmistosos, crear, eliminar, actualizarSala } = require("../controllers/friendly.controller");
const { verificarToken } = require("../middlewares/csrf.middleware.js")
const { limitadorCreacion } = require("../middlewares/rateLimit.middleware.js");

router.get("/amistosos", listarAmistosos)
router.post("/amistosos", verificarToken, limitadorCreacion, crear)
router.post("/amistosos/:id/eliminar", verificarToken, eliminar)
router.post("/amistosos/:id/sala", verificarToken, actualizarSala)

module.exports = router