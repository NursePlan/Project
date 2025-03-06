require('dotenv').config(); // Assicurati di caricare dotenv all'inizio
const mysql = require('mysql2');

console.log("DB_USER:", process.env.DB_USER);
console.log("DB_PASS:", process.env.DB_PASS);

const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT
});

connection.connect(err => {
  if (err) {
    console.error("Errore di connessione al database:", err);
  } else {
    console.log("Connessione al database riuscita!");
  }
});

module.exports = connection;
