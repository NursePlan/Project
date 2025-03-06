import { Box, IconButton, useTheme, Dialog, DialogActions, DialogTitle, Button } from "@mui/material";
import { useContext, useState } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const navigate = useNavigate();
  
  const [openLogoutDialog, setOpenLogoutDialog] = useState(false);

  const handleLogout = () => {
    setOpenLogoutDialog(false); // 🔹 Chiude prima il dialog
    setTimeout(() => {
      localStorage.removeItem("token");
      localStorage.removeItem("isAuthenticated");
      navigate("/login"); // 🔹 Usa il percorso corretto per la pagina di login
      window.location.reload(); // 🔹 Forza il refresh della pagina per aggiornare lo stato globale
    }, 200);
  };

  return (
    <>
      <Box display="flex" justifyContent="space-between" p={2}>
        {/* SEARCH BAR */}
        <Box display="flex" backgroundColor={colors.primary[400]} borderRadius="3px">
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* ICONS */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? <DarkModeOutlinedIcon /> : <LightModeOutlinedIcon />}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
          <IconButton onClick={() => setOpenLogoutDialog(true)} title="Logout">
            <ExitToAppIcon />
          </IconButton>
        </Box>
      </Box>

      {/* DIALOG DI CONFERMA LOGOUT */}
      <Dialog open={openLogoutDialog} onClose={() => setOpenLogoutDialog(false)}>
        <DialogTitle>Sei sicuro di voler uscire?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setOpenLogoutDialog(false)} color="primary">
            Annulla
          </Button>
          <Button onClick={handleLogout} color="secondary">
            Esci
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Topbar;
