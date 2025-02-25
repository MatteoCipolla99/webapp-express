const express = require("express");
const cors = require("cors");
const notFound = require("./middlewares/notFound");
const errorsHandler = require("./middlewares/errorsHandler");
const moviesRouter = require("./routers/moviesRouter");

const app = express();
const { PORT, FE_URL } = process.env;

//middleware CORS
app.use(
  cors({
    origin: FE_URL,
  })
);

// middleware per il parsing del req.body
app.use(express.json());

// middleware per i file statici
app.use(express.static("public"));

// Routes (le rotte della mia applicazione)
app.use("/movies", moviesRouter);

// Middlewares - Per la gestione degli errori (404, 500)
app.use(notFound);
app.use(errorsHandler);

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
