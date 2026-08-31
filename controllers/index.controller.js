const { messages } = require("../lib/messages");


function getMessages (req, res) {
    res.json(messages)
}

module.exports = {
    getMessages
}