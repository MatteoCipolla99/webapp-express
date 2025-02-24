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

    res.json(results);
  });
};

//Show
const show = (req, res) => {};

module.exports = { index, show };
