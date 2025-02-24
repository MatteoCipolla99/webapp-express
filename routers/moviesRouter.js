const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

//La liste delle rotte con la funzione corrispondente del controller

//Index
router.get("/", movieController.index);

//Show
router.get("/:id", movieController.show);

module.exports = router;
