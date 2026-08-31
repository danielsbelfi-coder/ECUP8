const express = require("express");
const router = express.Router()
const tournamentController = require("../controllers/tournament.controller.js");
const { verificarToken } = require("../middlewares/csrf.middleware.js");
const { limitadorCreacion } = require("../middlewares/rateLimit.middleware.js");


router.get("/", tournamentController.listar)

router.post("/torneos", verificarToken, limitadorCreacion, tournamentController.crear )

router.post("/torneos/:id/eliminar", verificarToken, tournamentController.eliminar )

module.exports = router;