const rateLimit = require("express-rate-limit");

const limitadorCreacion = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: "Estás creando torneos demasiado rápido. Intenta de nuevo en unos minutos.",
});

module.exports = {
    limitadorCreacion,
}