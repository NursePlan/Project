import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // Context per la gestione dell'autenticazione
import { TextField, Button, Box, Typography, Alert, Avatar } from "@mui/material";
import logonp from '../assets/logonp.png'; // Logo del progetto
import axios from "axios";  // Importa Axios
import './login.css'


const Login = ({ onLogin }) => { // Aggiungi onLogin come prop
  const [matricola, setMatricola] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Stato per gli errori
  const { login } = useAuth(); // Funzione di login dal contesto

  const handleLogin = async (e) => {
    e.preventDefault();
  
    console.log("🟢 handleLogin è stato chiamato!"); // 🔹 Controlla se la funzione viene eseguita
  
    try {
      const response = await axios.post("http://localhost:5001/api/auth/login", {
        matricola: matricola,
        password: password
      });
  
      console.log("✅ Risposta del server:", response.data); // 🔹 Controlla cosa ricevi dal server
  
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userName", `${response.data.nome} ${response.data.cognome}`); // ✅ Nome + Cognome
      localStorage.setItem("userLevel", response.data.livello);  // ✅ Salva il livello (SuperAdmin, Admin, User)
      localStorage.setItem("userRole", response.data.ruolo);    // ✅ Salva il ruolo (Sanitario, Tecnico, etc.)
      localStorage.setItem("userProfile", response.data.profilo); // ✅ Salva il profilo (Infermiere, Assistente Tecnico, etc.)
  
  
      if (response.data.nome) {
        console.log("✅ Nome utente ricevuto:", response.data.nome);
        localStorage.setItem("userName", response.data.nome);
      } else {
        console.log("⚠ Nessun nome ricevuto, impostato default 'Utente'");
        localStorage.setItem("userName", "Utente");
      }
  
      window.location.href = "/dashboard";
    } catch (error) {
      console.error("❌ Errore durante il login:", error.response?.data);
      alert(error.response?.data?.error || "Errore di login");
    }
  };
  


  return (

    <Box className="login"
      display="flex"
      flexDirection="column"
      align-items="center"
      component="form"
      onSubmit={handleLogin}
      sx={{
        width: 400,
        padding: 3,
        borderRadius: 2,
        boxShadow: 3,
        bgcolor: "primary.dark", // Colore di sfondo del modulo
      }}
    >
      <Typography variant="h2" component="h1" mb={2} textAlign="center">
        NursePlan Login
      </Typography>

      <Avatar
        alt="logo"
        src={logonp}
        sx={{ mx: "auto", textAlign: "center", bgcolor: "transparent", width: 56, height: 56 }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Matricola"
        variant="outlined"
        color="secondary"
        fullWidth
        margin="normal"
        value={matricola}
        onChange={(e) => {
          setMatricola(e.target.value);
          setError(null); // Resetta l'errore quando l'utente inizia a digitare
        }}
        required
      />
      <TextField
        label="Password"
        type="password"
        variant="outlined"
        color="secondary"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          setError(null); // Resetta l'errore quando l'utente inizia a digitare
        }}
        required
      />

      <Button
        type="submit"
        variant="contained"
        color="secondary" // Usa un colore predefinito
        fullWidth
        sx={{ mt: 2 }}
      >
        Accedi
      </Button>
    </Box>

  );
};

export default Login;