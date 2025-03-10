// Recupero la connessione al database
const connection = require("../data/db");

//Index
const index = (req, res) => {
  const sql = "SELECT * FROM movies";

  //lancio la query
  connection.execute(sql, (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed ${sql}`,
      });
    }

    const movies = results.map((movie) => {
      movie.image = `${process.env.BE_URL}/movies/${movie.image}`;
      return movie;
    });

    res.json(movies);
  });
};

//Show
const show = (req, res) => {
  //recupero l'id dalla rotta
  const { id } = req.params;

  // const movieSql = `
  //   SELECT *
  //   FROM movies
  //   WHERE id = ?`;
  const movieSql = `
    SELECT movies.*, ROUND(AVG(reviews.vote))
    FROM movies
    LEFT JOIN reviews ON movies.id = reviews.movie_id
    WHERE movies.id = ?
    GROUP BY movies.id`;

  //lancio la query preparata per leggere il film con id ?
  connection.execute(movieSql, [id], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed ${movieSql}`,
      });
    }
    //recupero il film dall'array dei risultati
    const movie = results[0];

    if (!movie) {
      return res.status(404).json({
        error: "Not Found",
        message: "Movie not found",
      });
    }

    // Modifico la proprietà image aggiungendo l'url completa
    movie.image = `${process.env.BE_URL}/movies/${movie.image}`;

    //query per recuperare le recensioni di quel film
    const reviewsSql = `
    SELECT * 
    FROM reviews
    WHERE movie_id = ?`;

    connection.execute(reviewsSql, [id], (err, results) => {
      if (err) {
        return res.status(500).json({
          error: "Query Error",
          message: `Database query failed ${reviewsSql}`,
        });
      }

      //aggiungo la chiave reviews
      movie.reviews = results;
      res.json(movie);
    });
  });
};

//Store review
const storeReview = (req, res) => {
  //recupero l'id dalla rotta
  const { id } = req.params;

  //recuperiamo il body della richiesta
  const { name, vote, text } = req.body;
  // preparare la query d'inserimento
  const sql =
    "INSERT INTO reviews(movie_id, name, vote, text) VALUES (?, ?, ?, ?)";
  //eseguire la query
  connection.execute(sql, [id, name, vote, text], (err, results) => {
    if (err) {
      return res.status(500).json({
        error: "Query Error",
        message: `Database query failed ${sql}`,
      });
    }
    //restituire la risposta al client
    res.status(201).json({ id: results.insertId });
  });
};

//Store
const store = (req, res) => {
  try {
    console.log("Body ricevuto:", req.body);
    console.log("File ricevuto:", req.file);

    // Verifica che il file esista
    if (!req.file) {
      return res.status(400).json({
        error: "File Error",
        message: "Nessun file caricato",
      });
    }

    //Recupero il nome dell'immagine caricata
    const image = req.file.filename;

    //recuperiamo il body della richiesta
    const { title, director, abstract } = req.body;

    // Valori predefiniti per i campi mancanti
    const genre = req.body.genre || "Genere";
    const release_year = req.body.release_year || new Date().getFullYear();

    console.log("Dati da inserire:", {
      title,
      director,
      genre,
      release_year,
      abstract,
      image,
    });

    // preparare la query d'inserimento
    const sql =
      "INSERT INTO movies (title, director, genre, release_year, abstract, image) VALUES (?, ?, ?, ?, ?, ?)";

    //eseguire la query
    connection.execute(
      sql,
      [title, director, genre, release_year, abstract, image],
      (err, results) => {
        if (err) {
          console.error("Errore SQL:", err);
          return res.status(500).json({
            error: "Query Error",
            message: `Database query failed: ${err.message}`,
          });
        }
        //restituire la risposta al client
        res.status(201).json({ id: results.insertId });
      }
    );
  } catch (error) {
    console.error("Errore generale:", error);
    res.status(500).json({
      error: "Server Error",
      message: error.message,
    });
  }
};
module.exports = { index, show, storeReview, store };
