const db = require('../config/db');

const Notifica = {
  getAll: (callback) => {
    db.query('SELECT * FROM notifica', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM notifica WHERE id = ?', [id], callback);
  },

  create: (notificaData, callback) => {
    const { matricola, oggetto, testo, stato } = notificaData;
    db.query(
      'INSERT INTO notifica (matricola, oggetto, testo, stato) VALUES (?, ?, ?, ?)',
      [matricola, oggetto, testo, stato],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM notifica WHERE id = ?', [id], callback);
  },
};

module.exports = Notifica;
