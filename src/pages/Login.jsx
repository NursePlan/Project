import { useState } from "react";
import { useAuth } from "../hooks/useAuth"; // Context per la gestione dell'autenticazione
import { TextField, Button, Box, Typography, Alert, Avatar } from "@mui/material";
import logonp from '../assets/logonp.png'; // Logo del progetto
import './login.css'

// Elenco statico di utenti validi
const validUsers = [
  { username: "admin", password: "admin123", role: "admin" },
  { username: "user", password: "user123", role: "user" },
  { username: "guest", password: "guest123", role: "guest" },
];

const Login = ({ onLogin }) => { // Aggiungi onLogin come prop
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null); // Stato per gli errori
  const { login } = useAuth(); // Funzione di login dal contesto

  const handleLogin = (e) => {
    e.preventDefault();

    // Verifica dell'utente
    const user = validUsers.find(
      (u) => u.username === username && u.password === password
    );

    if (user) {
      login({ username: user.username, role: user.role }); // Salva l'utente nel contesto
      onLogin(); // Chiama la funzione di login passata come prop
    } else {
      setError("Credenziali non valide");
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
        sx={{ mx:"auto", textAlign:"center", bgcolor:"transparent", width: 56, height: 56 }}
      />

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <TextField
        label="Username"
        variant="outlined"
        color="secondary"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => {
          setUsername(e.target.value);
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