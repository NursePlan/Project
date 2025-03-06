const db = require('../config/db');

const Turno = {
  getAll: (callback) => {
    db.query('SELECT * FROM turno', callback);
  },

  getById: (id, callback) => {
    db.query('SELECT * FROM turno WHERE id = ?', [id], callback);
  },

  create: (turnoData, callback) => {
    const { codiceturno, orainizio, orafine } = turnoData;
    db.query(
      'INSERT INTO turno (codiceturno, orainizio, orafine) VALUES (?, ?, ?)',
      [codiceturno, orainizio, orafine],
      callback
    );
  },

  delete: (id, callback) => {
    db.query('DELETE FROM turno WHERE id = ?', [id], callback);
  },
};

module.exports = Turno;
