import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./RegisterUser.css"; // Stile personalizzato

const RegisterUser = () => {
    const navigate = useNavigate();
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [matricola, setMatricola] = useState("");
    const [idlivello, setIdLivello] = useState("");
    const [idprofilo, setIdProfilo] = useState("");
    const [iduo, setIdUo] = useState("");
    const [idarea, setIdArea] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const [livelli, setLivelli] = useState([]);
    const [profili, setProfili] = useState([]);
    const [unitOperative, setUnitOperative] = useState([]);
    const [aree, setAree] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/get-livelli").then(res => setLivelli(res.data));
        axios.get("http://localhost:5000/get-profili").then(res => setProfili(res.data));
        axios.get("http://localhost:5000/get-unitoperative").then(res => setUnitOperative(res.data));
        axios.get("http://localhost:5000/get-aree").then(res => setAree(res.data));
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
            setMessage("Utente registrato con successo!");
        } catch (error) {
            setMessage(error.response?.data?.error || "Errore durante la registrazione");
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Registrazione Nuovo Utente</h2>
                <form onSubmit={handleRegister}>
                    <input type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} required />
                    <input type="text" placeholder="Cognome" value={cognome} onChange={(e) => setCognome(e.target.value)} required />
                    <input type="text" placeholder="Matricola" value={matricola} onChange={(e) => setMatricola(e.target.value)} required />
                    
                    <select value={idlivello} onChange={(e) => setIdLivello(e.target.value)} required>
                        <option value="">Seleziona Livello</option>
                        {livelli.map(liv => <option key={liv.id} value={liv.id}>{liv.descrizione}</option>)}
                    </select>

                    <select value={idprofilo} onChange={(e) => setIdProfilo(e.target.value)} required>
                        <option value="">Seleziona Profilo</option>
                        {profili.map(prof => <option key={prof.id} value={prof.id}>{prof.descrizione}</option>)}
                    </select>

                    <select value={iduo} onChange={(e) => setIdUo(e.target.value)} required>
                        <option value="">Seleziona Unità Operativa</option>
                        {unitOperative.map(uo => <option key={uo.id} value={uo.id}>{uo.descrizione}</option>)}
                    </select>

                    <select value={idarea} onChange={(e) => setIdArea(e.target.value)} required>
                        <option value="">Seleziona Area</option>
                        {aree.map(area => <option key={area.id} value={area.id}>{area.descrizione}</option>)}
                    </select>

                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />

                    <button type="submit">Registra Utente</button>
                </form>

                {message && <p style={{ color: "green" }}>{message}</p>}

                <button className="back-btn" onClick={() => navigate("/admin-dashboard")}>
                    Torna alla Dashboard
                </button>
            </div>
        </div>
    );
};

export default RegisterUser;
