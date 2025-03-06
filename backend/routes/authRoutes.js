const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db"); // Assicurati che il file di connessione esista
const router = express.Router();

// Login API
router.post("/login", async (req, res) => {
    const { matricola, password } = req.body;
    
    const sql = `
        SELECT 
            user.nome, 
            user.cognome, 
            user.idlivello, 
            user.idprofilo, 
            user.idruolo,
            level.descrizione AS livello,
            ruolo.descrizione AS ruolo,
            profilo.descrizione AS profilo
        FROM user
        JOIN level ON user.idlivello = level.id
        JOIN ruolo ON user.idruolo = ruolo.id
        JOIN profilo ON user.idprofilo = profilo.id
        WHERE user.matricola = ?
    `;

    db.query(sql, [matricola], async (err, results) => {
        if (err) {
            console.error("❌ Errore nel database:", err);
            return res.status(500).json({ error: "Errore interno al server" });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: "Credenziali non valide" });
        }

        const user = results[0];

        const token = jwt.sign(
            { id: user.id, matricola: user.matricola, idlivello: user.idlivello },
            process.env.JWT_SECRET,
            { expiresIn: "3h" }
        );

        return res.json({ 
            token: token, 
            nome: user.nome,
            cognome: user.cognome,
            livello: user.livello,  // ✅ Ora restituisce il livello come testo (SuperAdmin, Admin, User)
            ruolo: user.ruolo,      // ✅ Ora restituisce il ruolo (Sanitario, Tecnico, etc.)
            profilo: user.profilo   // ✅ Ora restituisce il profilo (Infermiere, Assistente Tecnico, etc.)
        });
    });
});



router.get("/users", (req, res) => {
    console.log("Headers ricevuti:", req.headers); // 🔍 Debug
    db.query("SELECT * FROM user", (err, results) => {
        if (err) {
            return res.status(500).json({ error: "Errore nel recupero utenti" });
        }
        return res.json(results);
    });
});



module.exports = router;
