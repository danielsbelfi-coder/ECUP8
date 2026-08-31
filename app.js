require("dotenv").config({ quiet: true });
const express = require("express")
const path = require("node:path")
const session = require("express-session")
const { engine } = require("express-handlebars");
const tournamentRouter = require("./routes/tournament.routes.js")
const authRouter = require("./routes/auth.routes.js")
const inscriptionRouter = require ("./routes/inscription.routes.js")
const indexRouter = require("./routes/index.routes.js");
const { generarToken } = require("./middlewares/csrf.middleware.js");
const isProduction = process.env.NODE_ENV === "production"


const app = express();

app.set("trust proxy", 1)

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: isProduction,
    }
}))

app.use(generarToken)

app.use(express.static(path.join(__dirname, "public")))

app.engine(".hbs", engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "views/layouts")
}))

app.set("view engine", ".hbs")
app.set("views", path.join(__dirname, "views"))

app.use(express.urlencoded({ extended: true }))
app.use("/auth", authRouter)
app.use("/", tournamentRouter)
app.use("/", inscriptionRouter)
app.use("/", indexRouter)

module.exports = {
    app
}