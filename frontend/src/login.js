import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = () => {
    const [matricola, setMatricola] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage("");

        try {
            const response = await axios.post("http://localhost:5000/login", { matricola, password });
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("idlivello", response.data.idlivello);
            localStorage.setItem("nome", response.data.nome);

            if (response.data.idlivello === 0 || response.data.idlivello === 1) {
                navigate("/admin-dashboard");
            } else {
                navigate("/user-dashboard");
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Errore di connessione.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-box">
                <h2>Accedi a NursePlan</h2>
                <form onSubmit={handleLogin}>
                    <input type="text" placeholder="Matricola" value={matricola} onChange={(e) => setMatricola(e.target.value)} required />
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    <button type="submit">Accedi</button>
                </form>
                {message && <p style={{ color: "red" }}>{message}</p>}
            </div>
        </div>
    );
};

export default Login;
