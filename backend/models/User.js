const db = require('../config/db');
const bcrypt = require("bcryptjs");

const User = {
  getAll: (callback) => {
    db.query('SELECT * FROM user', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM user WHERE id = ?', [id], callback);
  },

  create: (userData, callback) => {
    const { nome, cognome, matricola, idlivello, idprofilo, idruolo, idarea, iduo, email, password } = userData;

    // Cripta la password prima di salvarla
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return callback(err, null);

      db.query(
        'INSERT INTO user (nome, cognome, matricola, idlivello, idprofilo, idruolo, idarea, iduo, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nome, cognome, matricola, idlivello, idprofilo, idruolo, idarea, iduo, email, hash], // ✅ Ora la password è criptata
        callback
      );
    });
  },

  delete: (id, callback) => {
    db.query('DELETE FROM user WHERE id = ?', [id], callback);
  },
};

module.exports = User;
