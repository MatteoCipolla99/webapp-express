const express = require("express");
const multer = require("multer");
const router = express.Router();
const movieController = require("../controllers/movieController");

const storage = multer.diskStorage({
  destination: "public/movies",
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

//La liste delle rotte con la funzione corrispondente del controller

//Index
router.get("/", movieController.index);

//Show
router.get("/:id", movieController.show);

//Store review
router.post("/:id/reviews", movieController.storeReview);

//Store
router.post("/", upload.single(`image`), movieController.store);

module.exports = router;
