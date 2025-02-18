import React from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css"; // Stesso stile della Dashboard Admin

const UserDashboard = () => {
    const navigate = useNavigate();
    const nomeUtente = localStorage.getItem("nome"); // Recupera il nome

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("idlivello");
        localStorage.removeItem("nome");
        navigate("/login");
    };

    return (
        <div className="dashboard-container">
            <header>
                <h2>Benvenuto {nomeUtente} nella tua area personale!</h2>
            </header>
            <div className="dashboard-content">
                <aside className="sidebar">
                    <button onClick={handleLogout} className="logout-btn">Logout</button>
                </aside>
                <main className="main-content">
                    <p>Seleziona un'opzione dal menu laterale.</p>
                </main>
            </div>
        </div>
    );
};

export default UserDashboard;
