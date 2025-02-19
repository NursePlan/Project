import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Stile aggiornato

const AdminDashboard = () => {
    const navigate = useNavigate();
    const nomeUtente = localStorage.getItem("nome");
    const [users, setUsers] = useState([]);
    const [activeSection, setActiveSection] = useState("");

    // Stati del form di registrazione
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [matricola, setMatricola] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [idlivello, setIdLivello] = useState("");
    const [idarea, setIdArea] = useState("");
    const [idruolo, setIdRuolo] = useState("");
    const [idprofilo, setIdProfilo] = useState("");

    // Stati per caricare aree, ruoli e profili
    const [aree, setAree] = useState([]);
    const [ruoli, setRuoli] = useState([]);
    const [profili, setProfili] = useState([]);
    const [message, setMessage] = useState("");

    // Stati per la pagina modifica utente
    const [editMode, setEditMode] = useState(false); // Stato per mostrare la scheda modifica
    const [selectedUser, setSelectedUser] = useState(null); // Utente selezionato per la modifica

    useEffect(() => {
        axios.get("http://localhost:5000/get-aree").then(res => setAree(res.data));
        fetchUsers();
    }, []);

    // Quando cambia l'area, carichiamo i ruoli associati
    useEffect(() => {
        if (idarea) {
            axios.get(`http://localhost:5000/get-ruoli/${idarea}`)
                .then(res => setRuoli(res.data))
                .catch(err => console.error("Errore nel caricamento dei ruoli:", err));
            setIdRuolo("");
            setProfili([]);
        }
    }, [idarea]);

    // Quando cambia il ruolo, carichiamo i profili associati
    useEffect(() => {
        if (idruolo) {
            axios.get(`http://localhost:5000/get-profili/${idruolo}`)
                .then(res => setProfili(res.data))
                .catch(err => console.error("Errore nel caricamento dei profili:", err));
            setIdProfilo("");
        }
    }, [idruolo]);

    const openSection = (section) => {
        setMessage(""); // Resetta il messaggio quando si cambia sezione
        setActiveSection((prevSection) => {
            if (prevSection === section) {
                return ""; // Se la stessa sezione viene cliccata, la chiudiamo
            } else {
                if (section === "users") fetchUsers(); // Aggiorna la lista utenti se si apre la sezione utenti
                return section;
            }
        });
    };

    const fetchUsers = async () => {
        const token = localStorage.getItem("token"); // Recupera il token salvato

        if (!token) {
            console.error("❌ Nessun token trovato! Devi fare il login.");
            return;
        }

        try {
            const response = await axios.get("http://localhost:5000/get-users", {
                headers: { Authorization: `Bearer ${token}` }, // Invia il token nell'header
            });
            console.log("✅ Risposta dal server:", response.data);
            setUsers(response.data);
        } catch (error) {
            console.error("❌ Errore nel recupero utenti:", error);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage(""); // Pulisce il messaggio prima di inviare i dati

        console.log("📤 Tentativo di registrazione...");
        console.log("📋 Dati inviati:", { nome, cognome, matricola, email, idlivello, idarea, idruolo, idprofilo, password });

        const token = localStorage.getItem("token");

        try {
            const response = await axios.post("http://localhost:5000/register", {
                nome, cognome, matricola, email, idlivello, idarea, idruolo, idprofilo, password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            console.log("✅ Registrazione avvenuta con successo:", response.data);
            setMessage("✅ Utente inserito correttamente!");
            setNome(""); setCognome(""); setMatricola(""); setEmail("");
            setIdLivello(""); setIdArea(""); setIdRuolo(""); setIdProfilo(""); setPassword("");
            fetchUsers(); // Aggiorna la lista utenti

            // Nasconde il messaggio dopo 10 secondi
            setTimeout(() => setMessage(""), 10000);

        } catch (error) {
            console.error("❌ Errore durante la registrazione:", error.response?.data || error);
            setMessage(error.response?.data?.error || "❌ Errore durante la registrazione");

            // Nasconde il messaggio di errore dopo 10 secondi
            setTimeout(() => setMessage(""), 10000);
        }
    };


    const handleCancel = () => {
        setMessage("");
        setNome(""); setCognome(""); setMatricola(""); setEmail("");
        setIdLivello(""); setIdArea(""); setIdRuolo(""); setIdProfilo(""); setPassword("");
    };

    const handleLogout = () => {
        localStorage.clear();
        navigate("/login");
    };

    const handleDeleteUser = async (matricola) => {
        const confirmDelete = window.confirm("Sei sicuro di voler eliminare questo utente?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        try {
            await axios.delete(`http://localhost:5000/delete-user/${matricola}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMessage("✅ Utente eliminato con successo!");
            fetchUsers();

            // Nasconde il messaggio dopo 10 secondi
            setTimeout(() => setMessage(""), 10000);
        } catch (error) {
            console.error("❌ Errore durante l'eliminazione:", error);
            setMessage("❌ Errore durante l'eliminazione dell'utente.");

            // Nasconde il messaggio di errore dopo 10 secondi
            setTimeout(() => setMessage(""), 10000);
        }
    };

    const handleUpdateUser = async (e) => {
        e.preventDefault();
        setMessage("");

        const token = localStorage.getItem("token");

        try {
            await axios.put(`http://localhost:5000/update-user/${matricola}`, {
                nome, cognome, email, idlivello, idarea, idruolo, idprofilo
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            setMessage("✅ Utente aggiornato con successo!");
            fetchUsers(); // Aggiorna la lista utenti
            setEditMode(false); // Nasconde il modulo di modifica

            setTimeout(() => setMessage(""), 5000);
        } catch (error) {
            console.error("❌ Errore durante l'aggiornamento:", error);
            setMessage("❌ Errore durante l'aggiornamento dell'utente.");
        }
    };

    const openEditUser = (user) => {
        console.log("📝 Modifica utente selezionato:", user); // Debug per vedere i dati ricevuti
        setSelectedUser(user);
        setNome(user.nome);
        setCognome(user.cognome);
        setMatricola(user.matricola);
        setEmail(user.email);
        setIdLivello(user.idlivello);
        setIdArea(user.idarea); // ✅ Area corretta
        setIdRuolo(user.idruolo); // ✅ Ruolo ora è selezionato correttamente
        setIdProfilo(user.idprofilo); // ✅ Profilo ora è selezionato correttamente
        setActiveSection("edit");
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Benvenuto, <span className="username">{nomeUtente}</span>!</h1>
                <p className="subtitle">Sei nell'area riservata agli amministratori</p>
            </header>
            <div className="dashboard-content">
                <aside className="sidebar">
                    <button onClick={() => openSection("register")}>Registra un nuovo utente</button>
                    <button onClick={() => openSection("users")}>Visualizza utenti</button>
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </aside>

                <main className="main-content">
                    {activeSection === "register" && (
                        <div className="register-panel">
                            <h3>Registrazione Nuovo Utente</h3>
                            <form onSubmit={handleRegister}>
                                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                                <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                                <input type="text" placeholder="Matricola" value={matricola} onChange={(e) => setMatricola(e.target.value)} required />

                                <select value={idlivello} onChange={(e) => setIdLivello(e.target.value)} required>
                                    <option value="">Seleziona Livello</option>
                                    <option value="0">SuperAdmin</option>
                                    <option value="1">Admin</option>
                                    <option value="2">User</option>
                                </select>

                                <select value={idarea} onChange={(e) => setIdArea(e.target.value)} required>
                                    <option value="">Seleziona Area</option>
                                    {aree.map(area => <option key={area.id} value={area.id}>{area.descrizione}</option>)}
                                </select>

                                <select value={idruolo} onChange={(e) => setIdRuolo(e.target.value)} required>
                                    <option value="">Seleziona Ruolo</option>
                                    {ruoli.map(ruolo => (
                                        <option key={ruolo.id} value={ruolo.id}>
                                            {ruolo.descrizione}
                                        </option>
                                    ))}
                                </select>

                                <select value={idprofilo} onChange={(e) => setIdProfilo(e.target.value)} required>
                                    <option value="">Seleziona Profilo</option>
                                    {profili.map(profilo => (
                                        <option key={profilo.id} value={profilo.id}>
                                            {profilo.descrizione}
                                        </option>
                                    ))}
                                </select>

                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                                <button type="submit" onClick={() => console.log("✅ Pulsante Registra Utente premuto!")}>
                                    Registra Utente
                                </button>

                                <button type="button" className="cancel-btn" onClick={handleCancel}>Annulla</button>
                            </form>
                        </div>
                    )}

                    {editMode && selectedUser && (
                        <div className="register-panel">
                            <h3>Modifica Utente</h3>
                            <form onSubmit={handleUpdateUser}>
                                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                                <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                                <input type="text" placeholder="Matricola" value={matricola} disabled />

                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                                <select value={idlivello} onChange={(e) => setIdLivello(e.target.value)} required>
                                    <option value="">Seleziona Livello</option>
                                    <option value="0">SuperAdmin</option>
                                    <option value="1">Admin</option>
                                    <option value="2">User</option>
                                </select>

                                <select value={idarea} onChange={(e) => setIdArea(e.target.value)} required>
                                    <option value="">Seleziona Area</option>
                                    {aree.map(area => (
                                        <option key={area.id} value={area.id} selected={area.id == idarea}>
                                            {area.descrizione}
                                        </option>
                                    ))}
                                </select>

                                <select value={idruolo} onChange={(e) => setIdRuolo(e.target.value)} required>
                                    <option value="">Seleziona Ruolo</option>
                                    {ruoli.map(ruolo => (
                                        <option key={ruolo.id} value={ruolo.id} selected={ruolo.id == idruolo}>
                                            {ruolo.descrizione}
                                        </option>
                                    ))}
                                </select>

                                <select value={idprofilo} onChange={(e) => setIdProfilo(e.target.value)} required>
                                    <option value="">Seleziona Profilo</option>
                                    {profili.map(profilo => (
                                        <option key={profilo.id} value={profilo.id} selected={profilo.id == idprofilo}>
                                            {profilo.descrizione}
                                        </option>
                                    ))}
                                </select>

                                <button type="submit">Aggiorna Utente</button>
                                <button type="button" className="cancel-btn" onClick={() => setEditMode(false)}>Annulla</button>
                            </form>
                        </div>
                    )}

                    {activeSection === "users" && (
                        <div className="user-table">
                            <h3>Lista Utenti Registrati</h3>
                            <table className="styled-table">
                                <thead>
                                    <tr>
                                        <th>Matricola</th>
                                        <th>Nome</th>
                                        <th>Cognome</th>
                                        <th>Email</th>
                                        <th>Livello</th>
                                        <th>Area</th>
                                        <th>Ruolo</th>
                                        <th>Profilo</th>
                                        <th>Azioni</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.length > 0 ? (
                                        users.map((user) => (
                                            <tr key={user.matricola}>
                                                <td>{user.matricola}</td>
                                                <td>{user.nome}</td>
                                                <td>{user.cognome}</td>
                                                <td>{user.email}</td>
                                                <td>
                                                    {user.idlivello === 0 ? "SuperAdmin"
                                                        : user.idlivello === 1 ? "Admin"
                                                            : "User"}
                                                </td>
                                                <td>{user.area}</td>
                                                <td>{user.ruolo}</td>
                                                <td>{user.profilo}</td>
                                                <td>
                                                    {/* Pulsante per modificare l'utente */}
                                                    <button className="edit-btn" onClick={() => openEditUser(user)}>
                                                        ✏️
                                                    </button>

                                                    {/* Pulsante per eliminare l'utente */}
                                                    <button className="delete-btn" onClick={() => handleDeleteUser(user.matricola)}>
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="9" className="no-data">Nessun utente registrato</td>
                                        </tr>
                                    )}
                                </tbody>

                            </table>
                        </div>
                    )}

                    {activeSection === "edit" && (
                        <div className="edit-panel">
                            <h3>Modifica Utente</h3>
                            <p>Stai modificando l'utente: {selectedUser?.nome} {selectedUser?.cognome}</p>
                            <form onSubmit={handleUpdateUser}>
                                <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                                <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                                <input type="text" placeholder="Matricola" value={matricola} disabled />
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                                <select value={idarea} onChange={(e) => setIdArea(e.target.value)} required>
                                    <option value="">Seleziona Area</option>
                                    {aree.map(area => (
                                        <option key={area.id} value={area.id}>{area.descrizione}</option>
                                    ))}
                                </select>

                                <select value={idruolo} onChange={(e) => setIdRuolo(e.target.value)} required>
                                    <option value="">Seleziona Ruolo</option>
                                    {ruoli.map(ruolo => (
                                        <option key={ruolo.id} value={ruolo.id}>{ruolo.descrizione}</option>
                                    ))}
                                </select>

                                <select value={idprofilo} onChange={(e) => setIdProfilo(e.target.value)} required>
                                    <option value="">Seleziona Profilo</option>
                                    {profili.map(profilo => (
                                        <option key={profilo.id} value={profilo.id}>{profilo.descrizione}</option>
                                    ))}
                                </select>

                                <button type="submit">Salva Modifiche</button>
                                <button className="cancel-btn" onClick={() => setActiveSection("")}>Annulla</button>
                            </form>
                        </div>
                    )}


                </main>

                {/* Riquadro dei messaggi sulla destra - visibile solo se c'è un messaggio */}
                {message && (
                    <aside className="message-box">
                        <p className="message">{message}</p>
                    </aside>
                )}

            </div>
        </div>
    );
};

export default AdminDashboard;
