const express = require("express");
const { getMessages } = require("../controllers/index.controller");
const router = express.Router();

router.get("/messages", getMessages)

module.exports = router