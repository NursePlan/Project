const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 5000;

// Configurazione del database MySQL
const db = mysql.createConnection({
    host: "localhost",
    user: "root", // Modifica se hai un altro utente
    password: "", // Inserisci la password di MySQL se esiste
    database: "nurseplandb" // Nome del tuo database
});

db.connect(err => {
    if (err) {
        console.error("Errore di connessione al database:", err);
    } else {
        console.log("✅ Connessione a MySQL riuscita!");
    }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

// **ROUTE: Login con Matricola e Password**
app.post("/login", async (req, res) => {
    const { matricola, password } = req.body;

    db.query("SELECT * FROM user WHERE matricola = ?", [matricola], async (err, result) => {
        if (err) return res.status(500).json({ error: "Errore del server" });
        if (result.length === 0) return res.status(401).json({ error: "Credenziali errate! Matricola non trovata." });

        const user = result[0];

        // Confronta la password
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ error: "Credenziali errate! Password errata." });

        // Genera il token JWT includendo nome e idlivello
        const token = jwt.sign(
            { id: user.id, matricola: user.matricola, nome: user.nome, idlivello: user.idlivello }, 
            "your_secret_key", 
            { expiresIn: "1h" }
        );

        res.json({ 
            message: "Login effettuato con successo!", 
            token, 
            idlivello: user.idlivello, 
            nome: user.nome 
        });
    });
});



// **ROUTE: Registrazione con Matricola**
app.post("/register", async (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        console.error("❌ Token mancante");
        return res.status(401).json({ error: "Token mancante" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        if (decoded.idlivello !== 0 && decoded.idlivello !== 1) {
            console.error("❌ Accesso negato per idlivello:", decoded.idlivello);
            return res.status(403).json({ error: "Accesso negato!" });
        }
    } catch (error) {
        console.error("❌ Token non valido:", error.message);
        return res.status(401).json({ error: "Token non valido" });
    }

    const { nome, cognome, matricola, email, idlivello, idprofilo, idruolo, idarea, password } = req.body;

    console.log(`📝 Tentativo di registrazione: ${nome} ${cognome} - Matricola: ${matricola}`);

    if (!idruolo || !idarea) {
        console.error("❌ Manca idruolo o idarea");
        return res.status(400).json({ error: "Devi selezionare un Ruolo e un'Area!" });
    }

    // Controlliamo se la matricola esiste già
    db.query("SELECT * FROM user WHERE matricola = ?", [matricola], async (err, result) => {
        if (err) {
            console.error("❌ Errore nel controllo della matricola:", err);
            return res.status(500).json({ error: "Errore del server" });
        }

        if (result.length > 0) {
            console.error("❌ Matricola già registrata:", matricola);
            return res.status(400).json({ error: "Matricola già registrata!" });
        }

        // Controlliamo se l'email è già registrata
        db.query("SELECT * FROM user WHERE email = ?", [email], async (err, result) => {
            if (result.length > 0) {
                console.error("❌ Email già registrata:", email);
                return res.status(400).json({ error: "Email già in uso!" });
            }

            try {
                const hashedPassword = await bcrypt.hash(password, 10);

                // Inseriamo il nuovo utente
                db.query("INSERT INTO user (nome, cognome, matricola, email, idlivello, idprofilo, idruolo, idarea, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)", 
                    [nome, cognome, matricola, email, idlivello, idprofilo, idruolo, idarea, hashedPassword], 
                    (err, result) => {
                        if (err) {
                            console.error("❌ Errore durante l'inserimento:", err);
                            return res.status(500).json({ error: "Errore durante la registrazione" });
                        }
                        console.log("✅ Utente registrato con successo!");
                        res.json({ message: "Registrazione completata con successo!" });
                    }
                );
            } catch (error) {
                console.error("❌ Errore nella cifratura della password:", error);
                res.status(500).json({ error: "Errore durante la registrazione" });
            }
        });
    });
});


// API per ottenere i livelli
app.get("/get-livelli", (req, res) => {
    db.query("SELECT id, descrizione FROM level", (err, result) => {
        if (err) return res.status(500).json({ error: "Errore nel database" });
        res.json(result);
    });
});

// API per ottenere i profili
app.get("/get-profili", (req, res) => {
    db.query("SELECT id, descrizione FROM profilo", (err, result) => {
        if (err) return res.status(500).json({ error: "Errore nel database" });
        res.json(result);
    });
});

// API per ottenere i ruoli
app.get("/get-ruoli", (req, res) => {
    db.query("SELECT id, descrizione FROM ruolo", (err, result) => {
        if (err) return res.status(500).json({ error: "Errore nel recupero dei ruoli" });
        res.json(result);
    });
});

// API per ottenere le unità operative
app.get("/get-unitoperative", (req, res) => {
    db.query("SELECT id, descrizione FROM uo", (err, result) => {
        if (err) return res.status(500).json({ error: "Errore nel database" });
        res.json(result);
    });
});

// API per ottenere le aree di appartenenza
app.get("/get-aree", (req, res) => {
    db.query("SELECT id, descrizione FROM area", (err, result) => {
        if (err) return res.status(500).json({ error: "Errore nel database" });
        res.json(result);
    });
});

//API per ottenere la lista degli utenti
app.get("/get-users", async (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ error: "Token mancante" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        if (decoded.idlivello !== 0 && decoded.idlivello !== 1) {
            return res.status(403).json({ error: "Accesso negato!" });
        }
    } catch (error) {
        return res.status(401).json({ error: "Token non valido" });
    }

    db.query("SELECT matricola, nome, cognome, email, idlivello FROM user", (err, result) => {
        if (err) {
            console.error("Errore MySQL:", err); // Debug errore MySQL
            return res.status(500).json({ error: "Errore nel recupero utenti" });
        }
        console.log("Utenti trovati:", result); // Debug utenti trovati
        res.json(result);
    });
});

//API per eliminare dalla lista gli utenti
app.delete("/delete-user/:matricola", async (req, res) => {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        console.error("❌ Token mancante");
        return res.status(401).json({ error: "Token mancante" });
    }

    const token = authHeader.split(" ")[1];

    try {
        const decoded = jwt.verify(token, "your_secret_key");
        if (decoded.idlivello !== 0 && decoded.idlivello !== 1) {
            console.error("❌ Accesso negato per idlivello:", decoded.idlivello);
            return res.status(403).json({ error: "Accesso negato!" });
        }
    } catch (error) {
        console.error("❌ Token non valido:", error.message);
        return res.status(401).json({ error: "Token non valido" });
    }

    const { matricola } = req.params;

    console.log(`🗑️ Tentativo di eliminazione dell'utente con matricola: ${matricola}`);

    db.query("DELETE FROM user WHERE matricola = ?", [matricola], (err, result) => {
        if (err) {
            console.error("❌ Errore durante l'eliminazione:", err);
            return res.status(500).json({ error: "Errore durante l'eliminazione dell'utente" });
        }
        console.log("✅ Utente eliminato con successo!");
        res.json({ message: "Utente eliminato con successo!" });
    });
});


// Avvia il server
app.listen(PORT, () => {
    console.log(`🚀 Server in ascolto sulla porta ${PORT}`);
});
