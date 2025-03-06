const User = require('../models/User');

const getAllUsers = (req, res) => {
    const sql = `
        SELECT u.id, u.nome, u.cognome, u.matricola, 
               l.descrizione AS livello, 
               p.descrizione AS profilo, 
               r.descrizione AS ruolo, 
               a.descrizione AS area, 
               uo.descrizione AS unita_operativa, 
               u.email 
        FROM user u
        JOIN level l ON u.idlivello = l.id
        JOIN profilo p ON u.idprofilo = p.id
        JOIN ruolo r ON u.idruolo = r.id
        JOIN area a ON u.idarea = a.id
        JOIN uo uo ON u.iduo = uo.id;
    `;

    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ error: "Errore nel recupero utenti" });
        res.json(results);
    });
};

module.exports = { getAllUsers };

const UserController = {
    getAllUsers: (req, res) => {
        db.query("SELECT * FROM user", (err, results) => {
            if (err) return res.status(500).json({ error: "Errore nel recupero utenti" });
            res.json(results);
        });
    },

    getAllUsers: (req, res) => {
        const sql = `
            SELECT u.id, u.nome, u.cognome, u.matricola, 
                   l.descrizione AS livello, 
                   p.descrizione AS profilo, 
                   r.descrizione AS ruolo, 
                   a.descrizione AS area, 
                   uo.descrizione AS unita_operativa, 
                   u.email 
            FROM user u
            JOIN level l ON u.idlivello = l.id
            JOIN profilo p ON u.idprofilo = p.id
            JOIN ruolo r ON u.idruolo = r.id
            JOIN area a ON u.idarea = a.id
            JOIN uo uo ON u.iduo = uo.id;
        `;

        db.query(sql, (err, results) => {
            if (err) return res.status(500).json({ error: "Errore nel recupero utenti" });
            res.json(results);
        });
    },


    getUserById: (req, res) => {
        const { id } = req.params;
        User.getById(id, (err, results) => {
            if (err) return res.status(500).json({ message: 'Errore del server' });
            if (results.length === 0) return res.status(404).json({ message: 'Utente non trovato' });
            res.json(results[0]);
        });
    },

    createUser: (req, res) => {
        User.create(req.body, (err, result) => {
            if (err) return res.status(500).json({ message: 'Errore del server' });
            res.json({ message: 'Utente creato con successo', id: result.insertId });
        });
    },

    deleteUser: (req, res) => {
        const { id } = req.params;
        User.delete(id, (err) => {
            if (err) return res.status(500).json({ message: 'Errore del server' });
            res.json({ message: 'Utente eliminato' });
        });
    },
};

module.exports = UserController;
