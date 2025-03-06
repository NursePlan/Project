// Importazione dei moduli necessari da React e Material-UI
import { useState } from "react"; // Hook per gestire lo stato del componente
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"; // Componenti per il routing
import { CssBaseline, ThemeProvider } from "@mui/material"; // Componenti per lo styling e la gestione dei temi

// Importazione di componenti personalizzati e funzioni di utilità
import { ColorModeContext, useMode } from "./theme"; // Contesto e hook per la modalità colore
import { AuthProvider } from "./context/AuthContext"; // Contesto per autenticazione
import PrivateRoute from "./utils/PrivateRoute"; // Componente per la protezione delle rotte
import { Permissions } from "./utils/roles"; // Definizione dei permessi

import Topbar from "./scenes/global/Topbar"; // Componente per la barra superiore
import Sidebar from "./scenes/global/Sidebar"; // Componente per la barra laterale
import Dashboard from "./scenes/dashboard"; // Componente per la dashboard
import Team from "./scenes/team"; // Componente per la pagina del team
import Contacts from "./scenes/contacts"; // Componente per la pagina dei contatti
import Invoices from "./scenes/invoices"; // Componente per la pagina delle fatture
import Form from "./scenes/form"; // Componente per la pagina del form
import Calendar from "./scenes/calendar"; // Componente per la pagina del calendario
import Bar from "./scenes/bar"; // Componente per il grafico a barre
import Pie from "./scenes/pie"; // Componente per il grafico a torta
import Line from "./scenes/line"; // Componente per il grafico a linee
import AdminPage from "./pages/AdminPage"; // Componente per la pagina admin
import UserPage from "./pages/UserPage"; // Componente per la pagina utente
import GuestPage from "./pages/GuestPage"; // Componente per la pagina ospite
import Unauthorized from "./pages/Unauthorized"; // Componente per la pagina non autorizzata
import Login from "./pages/Login"; // Componente per la pagina di login

// Definizione del componente App
function App() {
  const [theme, colorMode] = useMode(); // Inizializzazione del tema e della funzione per cambiare la modalità colore
  const [isSidebar, setIsSidebar] = useState(true); // Inizializzazione dello stato della barra laterale (visibile di default)
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Stato per gestire l'autenticazione

  // Funzione per gestire il login
  const handleLogin = () => {
    setIsAuthenticated(true); // Imposta l'autenticazione a true
  };

  // Renderizzazione del componente
  return (
    <AuthProvider> {/* Fornisce il contesto dell'autenticazione ai componenti figli */}
      <ColorModeContext.Provider value={colorMode}> {/* Fornisce il contesto della modalità colore ai componenti figli */}
        <ThemeProvider theme={theme}> {/* Fornisce il tema Material-UI ai componenti figli */}
          <CssBaseline /> {/* Applica gli stili di base di Material-UI */}
          <div className="app"> {/* Contenitore principale dell'applicazione */}
            {isAuthenticated ? ( // Mostra Sidebar e Topbar solo se autenticato
              <>
                <Sidebar isSidebar={isSidebar} /> {/* Renderizza la barra laterale */}
                <main className="content"> {/* Contenitore principale del contenuto */}
                  <Topbar setIsSidebar={setIsSidebar} /> {/* Renderizza la barra superiore */}
                  <Routes> {/* Definisce le rotte dell'applicazione */}
                    {/* Rotte protette */}
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute allowedRoles={["admin", "user"]}>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/admin"
                      element={
                        <PrivateRoute allowedRoles={Permissions.AdminPage}>
                          <AdminPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/user"
                      element={
                        <PrivateRoute allowedRoles={Permissions.UserPage}>
                          <UserPage />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/guest"
                      element={
                        <PrivateRoute allowedRoles={Permissions.GuestPage}>
                          <GuestPage />
                        </PrivateRoute>
                      }
                    />

                    {/* Altre rotte */}
                    <Route path="/team" element={<Team />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/invoices" element={<Invoices />} />
                    <Route path="/form" element={<Form />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/bar" element={<Bar />} />
                    <Route path="/pie" element={<Pie />} />
                    <Route path="/line" element={<Line />} />
                  </Routes>
                </main>
              </>
            ) : (
              <Routes> {/* Definisce le rotte dell'applicazione */}
                <Route path="/" element={<Login onLogin={handleLogin} />} /> {/* Passa handleLogin come prop */}
              </Routes>
            )}
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

// Esportazione del componente App per l'utilizzo in altri moduli
export default App;