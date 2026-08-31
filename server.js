require("dotenv").config();
const { app } = require("./app.js")

const PORT = process.env.PORT || 3000;

const iniciarServidor = async () => {
    await app.listen(PORT,  () => {
        console.log(`Server running on http://localhost:${PORT}`)
    })
}

iniciarServidor()