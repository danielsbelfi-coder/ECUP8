const express = require("express");
const router = express.Router();
const { join, leave } = require("../controllers/friendly_inscription.controller");
const { verificarToken } = require("../middlewares/csrf.middleware");


router.post("/amistosos/:id/unirse", verificarToken, join)
router.post("/amistosos/:id/salir", verificarToken, leave)

module.exports = router