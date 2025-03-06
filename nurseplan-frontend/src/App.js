import { Routes, Route, Navigate } from "react-router-dom"; // ✅ Senza <Router>
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./utils/PrivateRoute";
import { Permissions } from "./utils/roles";

import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Contacts from "./scenes/contacts";
import AdminPage from "./pages/AdminPage";
import UserPage from "./pages/UserPage";
import GuestPage from "./pages/GuestPage";
import Unauthorized from "./pages/Unauthorized";
import Login from "./pages/Login";

function App() {
  const [theme, colorMode] = useMode();
  const isAuthenticated = !!localStorage.getItem("token");

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            {isAuthenticated ? (
              <>
                <Sidebar />
                <main className="content">
                  <Topbar />
                  <Routes> {/* ✅ Nessun <Router>, solo <Routes> */}
                    <Route path="/" element={<Navigate to="/dashboard" />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/team" element={<Team />} />
                    <Route path="/contacts" element={<Contacts />} />
                    <Route path="/admin" element={<PrivateRoute allowedRoles={Permissions.AdminPage}><AdminPage /></PrivateRoute>} />
                    <Route path="/user" element={<PrivateRoute allowedRoles={Permissions.UserPage}><UserPage /></PrivateRoute>} />
                  </Routes>
                </main>
              </>
            ) : (
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            )}
          </div>
        </ThemeProvider>
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;
