import { useState, useEffect } from "react";
import axios from "axios";
import { Box, Typography, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { tokens } from "../../theme";
import AdminPanelSettingsOutlinedIcon from '@mui/icons-material/AdminPanelSettingsOutlined';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import Header from "../../components/Header";

const Team = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("Token inviato nella richiesta:", token); // 🔍 Debug
  
    axios.get("http://localhost:5001/api/users", {
      headers: { 
        "Authorization": `Bearer ${token}`, // 🔹 Formato corretto
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      console.log("Dati ricevuti:", response.data); // 🔍 Debug
      setRows(response.data);
    })
    .catch(error => console.error("Errore caricamento utenti:", error));
  }, []);
  

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nome', headerName: 'Nome', flex: 1 },
    { field: 'cognome', headerName: 'Cognome', flex: 1 },
    { field: 'matricola', headerName: 'Matricola', flex: 1 },
    { field: 'livello', headerName: 'Livello', flex: 1 },
    { field: 'profilo', headerName: 'Profilo', flex: 1 },
    { field: 'ruolo', headerName: 'Ruolo', flex: 1 },
    { field: 'area', headerName: 'Area', flex: 1 },
    { field: 'unita_operativa', headerName: 'Unità Operativa', flex: 1 },
    { field: 'email', headerName: 'Email', flex: 1 },
  ];

  return (
    <Box m="20px" p="10px">
      <Header title="Team" subtitle="Gestione degli utenti" />
      <Box
        m="40px 0 0 0"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": { border: "none" },
          "& .MuiDataGrid-cell": { borderBottom: "none !important", textAlign: "center !important" },
          "& .MuiDataGrid-columnHeader": { backgroundColor: colors.blueAccent[500], borderBottom: "none" },
          "& .MuiDataGrid-virtualScroller": { backgroundColor: colors.primary[400] },
          "& .MuiDataGrid-footerContainer": { borderTop: "none", backgroundColor: colors.blueAccent[500] },
        }}
      >
        <DataGrid rows={rows} columns={columns} />
      </Box>
    </Box>
  );
}

export default Team;
