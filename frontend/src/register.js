import React, { useState, useEffect } from "react";
import axios from "axios";
import "./register.css"; // Stile uguale alla Login

const Register = () => {
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [matricola, setMatricola] = useState("");
    const [idlivello, setIdLivello] = useState("");
    const [idprofilo, setIdProfilo] = useState("");
    const [iduo, setIdUo] = useState("");
    const [idarea, setIdArea] = useState(""); // Nuovo campo
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    // Opzioni per i dropdown (Dati recuperati dal database)
    const [livelli, setLivelli] = useState([]);
    const [profili, setProfili] = useState([]);
    const [unitOperative, setUnitOperative] = useState([]);
    const [aree, setAree] = useState([]); // Nuovo stato per le Aree

    // Recupera i dati per i dropdown dal backend
    useEffect(() => {
        axios.get("http://localhost:5000/get-livelli").then(res => setLivelli(res.data));
        axios.get("http://localhost:5000/get-profili").then(res => setProfili(res.data));
        axios.get("http://localhost:5000/get-unitoperative").then(res => setUnitOperative(res.data));
        axios.get("http://localhost:5000/get-aree").then(res => setAree(res.data)); // Carichiamo le aree
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/register", {
                nome,
                cognome,
                matricola,
                idlivello,
                idprofilo,
                iduo,
                idarea,
                password
            });
            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.error || "Errore durante la registrazione");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Registrazione</h2>
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="Matricola" value={matricola} onChange={(e) => setMatricola(e.target.value)} required />
                    </div>
                    <div className="input-group">
                        <select value={idlivello} onChange={(e) => setIdLivello(e.target.value)} required>
                            <option value="">Seleziona Livello</option>
                            {livelli.map(liv => <option key={liv.id} value={liv.id}>{liv.descrizione}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <select value={idprofilo} onChange={(e) => setIdProfilo(e.target.value)} required>
                            <option value="">Seleziona Profilo</option>
                            {profili.map(prof => <option key={prof.id} value={prof.id}>{prof.descrizione}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <select value={iduo} onChange={(e) => setIdUo(e.target.value)} required>
                            <option value="">Seleziona Unità Operativa</option>
                            {unitOperative.map(uo => <option key={uo.id} value={uo.id}>{uo.descrizione}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <select value={idarea} onChange={(e) => setIdArea(e.target.value)} required>
                            <option value="">Seleziona Area</option>
                            {aree.map(area => <option key={area.id} value={area.id}>{area.descrizione}</option>)}
                        </select>
                    </div>
                    <div className="input-group">
                        <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>
                    <button type="submit" className="register-button">Registrati</button>
                </form>
                {message && <p className="error-message">{message}</p>}
                <p className="login-link">Hai già un account? <a href="/login">Accedi</a></p>
            </div>
        </div>
    );
};

export default Register;
