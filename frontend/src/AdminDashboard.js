import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Stile aggiornato

const AdminDashboard = () => {
    const navigate = useNavigate();
    const nomeUtente = localStorage.getItem("nome"); // Recupera il nome
    //const [showRegisterForm, setShowRegisterForm] = useState(false);
    //const [showUserTable, setShowUserTable] = useState(false); // Controllo per mostrare la tabella utenti
    const [users, setUsers] = useState([]); // Stato per memorizzare la lista utenti
    const [activeSection, setActiveSection] = useState(""); // Controlla la sezione attiva

    // Stati del form di registrazione
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [matricola, setMatricola] = useState("");
    const [email, setEmail] = useState("");
    const [idlivello, setIdLivello] = useState("");
    const [idprofilo, setIdProfilo] = useState("");
    const [iduo, setIdUo] = useState("");
    const [idruolo, setIdRuolo] = useState(""); // Nuovo stato per il ruolo
    const [idarea, setIdArea] = useState(""); // Nuovo stato per l'area
    const [profili, setProfili] = useState([]);
    const [ruoli, setRuoli] = useState([]); // Stato per memorizzare i ruoli
    const [aree, setAree] = useState([]); // Stato per memorizzare le aree
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchUsers(); // Carica gli utenti all'avvio
        axios.get("http://localhost:5000/get-profili").then(res => setProfili(res.data));
        axios.get("http://localhost:5000/get-ruoli").then(res => setRuoli(res.data));
        axios.get("http://localhost:5000/get-aree").then(res => setAree(res.data)); // Recupero aree
    }, []);

    // per controllare lo stato della scheda aperta
    const openSection = (section) => {
        setMessage(""); // Resetta il messaggio di avviso quando si cambia sezione
        setActiveSection((prevSection) => (prevSection === section ? "" : section));
    };

    // Funzione per ottenere la lista utenti
    const fetchUsers = async () => {
        const token = localStorage.getItem("token"); // Recupera il token
        try {
            const response = await axios.get("http://localhost:5000/get-users", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (error) {
            console.error("Errore nel recupero utenti:", error);
        }
    };

    // Funzione per registrare un nuovo utente
    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");
    
        const token = localStorage.getItem("token");
    
        console.log("📤 Dati inviati:", { nome, cognome, matricola, email, idlivello, idprofilo, idruolo, idarea, password });
    
        try {
            const response = await axios.post("http://localhost:5000/register", {
                nome,
                cognome,
                matricola,
                email,
                idlivello,
                idprofilo,
                idruolo,
                idarea,
                password
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
    
            setMessage("✅ Utente inserito correttamente!");
            setNome(""); setCognome(""); setMatricola(""); setEmail("");
            setIdLivello(""); setIdProfilo(""); setIdRuolo(""); setIdArea(""); setPassword("");
    
            fetchUsers(); // Aggiorna la lista utenti
        } catch (error) {
            console.error("❌ Errore durante la registrazione:", error.response?.data || error);
            setMessage(error.response?.data?.error || "❌ Errore durante la registrazione");
        }
    };
    

    // Funzione per pulire il form quando si annulla
    const handleCancel = () => {
        //setShowRegisterForm(false);
        setMessage("");
        setNome(""); setCognome(""); setMatricola(""); setEmail("");
        setIdLivello(""); setIdProfilo(""); setIdUo(""); setPassword("");
    };

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("idlivello");
        localStorage.removeItem("nome");
        navigate("/login");
    };

    // Funzione per eliminare gli utenti
    const handleDeleteUser = async (matricola) => {
        const confirmDelete = window.confirm("Sei sicuro di voler eliminare questo utente?");
        if (!confirmDelete) return;

        const token = localStorage.getItem("token");

        console.log(`🗑️ Eliminazione utente con matricola: ${matricola}`);

        try {
            const response = await axios.delete(`http://localhost:5000/delete-user/${matricola}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log("✅ Risposta dal server:", response.data);
            setMessage("✅ Utente eliminato con successo!");
            fetchUsers(); // Aggiorna la lista utenti dopo l'eliminazione
        } catch (error) {
            console.error("❌ Errore durante l'eliminazione:", error);
            setMessage("❌ Errore durante l'eliminazione dell'utente.");
        }
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
                                <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />

                                <select value={idlivello} onChange={(e) => setIdLivello(e.target.value)} required>
                                    <option value="">Seleziona Livello</option>
                                    <option value="0">SuperAdmin</option>
                                    <option value="1">Admin</option>
                                    <option value="2">User</option>
                                </select>

                                <select value={idprofilo} onChange={(e) => setIdProfilo(e.target.value)} required>
                                    <option value="">Seleziona Profilo</option>
                                    {profili.map(profilo => <option key={profilo.id} value={profilo.id}>{profilo.descrizione}</option>)}
                                </select>

                                {/* Controlla che il valore venga aggiornato */}
                                <select value={idruolo} onChange={(e) => {
                                    setIdRuolo(e.target.value);
                                    console.log("Selezionato Ruolo:", e.target.value); // Debug
                                }} required>
                                    <option value="">Seleziona Ruolo</option>
                                    {ruoli.map(ruolo => <option key={ruolo.id} value={ruolo.id}>{ruolo.descrizione}</option>)}
                                </select>

                                <select value={idarea} onChange={(e) => {
                                    setIdArea(e.target.value);
                                    console.log("Selezionata Area:", e.target.value); // Debug
                                }} required>
                                    <option value="">Seleziona Area</option>
                                    {aree.map(area => <option key={area.id} value={area.id}>{area.descrizione}</option>)}
                                </select>

                                <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                                <button type="submit">Registra Utente</button>
                            </form>
                            <button className="cancel-btn" onClick={handleCancel}>Annulla</button>
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
                                                <td>
                                                    <button className="delete-btn" onClick={() => handleDeleteUser(user.matricola)}>
                                                        🗑️
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="no-data">Nessun utente registrato</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
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
