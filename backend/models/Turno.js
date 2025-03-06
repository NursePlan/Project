const db = require('../config/db');

const User = {
  getAll: (callback) => {
    db.query('SELECT * FROM user', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM user WHERE id = ?', [id], callback);
  },

  create: (userData, callback) => {
    const { nome, cognome, matricola, idlivello, idprofilo, idruolo, idarea, iduo, email, password } = userData;
    db.query(
      'INSERT INTO user (nome, cognome, matricola, idlivello, idprofilo, idruolo, idarea, iduo, email, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, cognome, matricola, idlivello, idprofilo, idruolo, idarea, iduo, email, password],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM user WHERE id = ?', [id], callback);
  },
};

module.exports = User;
