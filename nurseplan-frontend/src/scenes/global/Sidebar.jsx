import { useState, useEffect } from "react";
import { ProSidebar, Menu, MenuItem } from "react-pro-sidebar";
import "react-pro-sidebar/dist/css/styles.css"; /*utilizziamo la versione 0.7.1, perchè anche se più vecchia, è la più diffusa ed è quella che comprende uno stile css di default*/
import { Box, IconButton, Typography, useTheme } from "@mui/material";
import { Link } from "react-router-dom";/*importiamo link per poter creare link interni partendo dalle icone della sidebar. in pratica stiamo creando una navbar verticale collapsible*/
import cat1 from '../../assets/cat1.jpg';
import { tokens } from "../../theme";

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PeopleOutlinedIcon from "@mui/icons-material/PeopleOutlined";
import ContactsOutlinedIcon from "@mui/icons-material/ContactsOutlined";
import ReceiptOutlinedIcon from "@mui/icons-material/ReceiptOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import HelpOutlineOutlinedIcon from "@mui/icons-material/HelpOutlineOutlined";
import BarChartOutlinedIcon from "@mui/icons-material/BarChartOutlined";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import TimelineOutlinedIcon from "@mui/icons-material/TimelineOutlined";
import MenuOutlinedIcon from "@mui/icons-material/MenuOutlined";
import MapOutlinedIcon from "@mui/icons-material/MapOutlined";

/* Funzionamento del Componente

- **Stato della Sidebar**: La sidebar può essere espansa o compressa, gestita dallo stato `isCollapsed`. Quando l'utente clicca sull'icona del menu, lo stato cambia, e la sidebar si espande o si comprime di conseguenza.

- **Profilo Utente**: Se la sidebar è espansa, viene visualizzato un profilo utente con un'immagine e il nome. Questo fornisce un tocco personale all'interfaccia.

- **Elementi di Menu**: Ogni elemento di menu è rappresentato dal componente `Item`, che mostra un'icona e un titolo. Quando un elemento viene selezionato, il suo stato viene aggiornato, e il colore cambia per indicare che è attivo.

- **Se zioni**: La sidebar è suddivisa in sezioni, ognuna con un titolo, come "Data", "Pages" e "Charts". Questo aiuta a organizzare meglio le voci di menu e a migliorare l'esperienza utente.

- **Navigazione**: Utilizzando il componente `Link` di React Router, ogni elemento di menu è collegato a una rotta specifica dell'applicazione. Quando un utente clicca su un elemento, viene reindirizzato alla pagina corrispondente.

- **Stili Personalizzati**: Utilizziamo `sx` per applicare stili personalizzati alla sidebar, come il colore di sfondo e il comportamento al passaggio del mouse. Questo rende la sidebar visivamente coerente con il tema dell'applicazione.

 il componente `Sidebar` fornisce una navigazione intuitiva e ben strutturata per l'applicazione, con un design responsive e personalizzabile. Gestisce lo stato della sidebar, visualizza informazioni utente e consente la navigazione tra diverse sezioni dell'applicazione.*/

/* questo è lo schema di  un singolo elemento della sidebar (MenuItem), Prosidebar ci propone già questa struttura, cioè quella di un unico componente già strutturato. In un processo più artigianale ogni menu item potrebbe essere un componente a se da montare */
const Item = ({ title, to, icon, selected, setSelected }) => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  return (
    <MenuItem
      active={selected === title}
      style={{
        color: colors.grey[100],
      }}
      onClick={() => setSelected(title)}
      icon={icon}
    >
      <Typography>{title}</Typography>
      <Link to={to} />
    </MenuItem>
  );
};

const Sidebar = () => {
  const theme = useTheme(); /*utilizziamo il tema per poter accedere ai colori predefiniti*/
  const colors = tokens(theme.palette.mode); // otteniamo il colore del tema attuale
  const [isCollapsed, setIsCollapsed] = useState(false); /*stato per gestire la sidebar*/
  const [selected, setSelected] = useState("Dashboard"); /*stato per gestire la selezione di un menu item*/

  // 🔹 Stato per il nome dell'utente
  const [userName, setUserName] = useState("Utente");
  const [userLevel, setUserLevel] = useState("Livello");
  const [userRole, setUserRole] = useState("Ruolo");
  const [userProfile, setUserProfile] = useState("Profilo");

  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    const storedLevel = localStorage.getItem("userLevel");
    const storedRole = localStorage.getItem("userRole");
    const storedProfile = localStorage.getItem("userProfile");

    if (storedName) setUserName(storedName);
    if (storedLevel) setUserLevel(storedLevel); // ✅ Converte il livello in testo
    if (storedRole) setUserRole(storedRole); // ✅ Converte il livello in testo
    if (storedProfile) setUserProfile(storedProfile);
  }, []);


  return (
    // inserisco un Box Mui e modifico per renderlo coerente con il tema creato
    <Box
      sx={{
        "& .pro-sidebar-inner": {
          background: `${colors.primary[400]} !important`,
        },
        "& .pro-icon-wrapper": {
          backgroundColor: "transparent !important",
        },
        "& .pro-inner-item": {
          padding: "5px 35px 5px 20px !important",
        },
        "& .pro-inner-item:hover": {
          color: "#868dfb !important",
        },
        "& .pro-menu-item.active": {
          color: "#6870fa !important",
        },
      }}
    >
      <ProSidebar collapsed={isCollapsed}> {/*il componente ProSideBar è figlio del Box, da cui eredita lo stile*/}
        <Menu iconShape="square">
          {/* LOGO TESTUALE */}
          <MenuItem
            onClick={() => setIsCollapsed(!isCollapsed)}
            icon={isCollapsed ? <MenuOutlinedIcon /> : undefined}
            style={{
              margin: "10px 0 20px 0",
              color: colors.grey[100],
            }}
          >
            {!isCollapsed && (
              <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                ml="15px"
              >
                <Typography variant="h3" fontWeight={600} color={colors.grey[100]}>
                  {userLevel} {/* 🔹 Mostra il livello dell'utente */}
                </Typography>
                <IconButton onClick={() => setIsCollapsed(!isCollapsed)}>
                  <MenuOutlinedIcon />
                </IconButton>
              </Box>
            )}
          </MenuItem>

          {/* PROFILO UTENTE */}
          {!isCollapsed && (
            <Box mb="25px">
              <Box display="flex" justifyContent="center" alignItems="center">
                <img
                  alt="profile-user"
                  width="100px"
                  height="100px"
                  src={cat1}
                  style={{ cursor: "pointer", borderRadius: "50%" }}
                />
              </Box>
              <Box textAlign="center">
                <Typography variant="h2" color={colors.grey[100]} fontWeight="bold" sx={{ m: "10px 0 0 0" }}>
                  {userName} {/* 🔹 Mostra il nome dell'utente */}
                </Typography>
                <Typography variant="h5" color={colors.greenAccent[500]}>
                  {userRole} {/* 🔹 Mostra il ruolo dell'utente */}
                </Typography>
              </Box>
            </Box>
          )}

          <Box paddingLeft={isCollapsed ? undefined : "10%"}>
            <Item
              title="Dashboard"
              to="/"
              icon={<HomeOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/*separatore sezione con tipografia diversa*/}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Data
            </Typography>

            {/*-------------------------------------------*/}

            <Item
              title="Gruppo di Lavoro"
              to="/team"
              icon={<PeopleOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Anagrafica"
              to="/contacts"
              icon={<ContactsOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Invoices Balances"
              to="/invoices"
              icon={<ReceiptOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/*separatore sezione con tipografia diversa*/}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Pages
            </Typography>

            {/*-------------------------------------------*/}

            <Item
              title="Profile Form"
              to="/form"
              icon={<PersonOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Calendar"
              to="/calendar"
              icon={<CalendarTodayOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="FAQ Page"
              to="/faq"
              icon={<HelpOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />

            {/*separatore sezione con tipografia diversa*/}

            <Typography
              variant="h6"
              color={colors.grey[300]}
              sx={{ m: "15px 0 5px 20px" }}
            >
              Charts
            </Typography>

            {/*-------------------------------------------*/}

            <Item
              title="Bar Chart"
              to="/bar"
              icon={<BarChartOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Pie Chart"
              to="/pie"
              icon={<PieChartOutlineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Line Chart"
              to="/line"
              icon={<TimelineOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
            <Item
              title="Geography Chart"
              to="/geography"
              icon={<MapOutlinedIcon />}
              selected={selected}
              setSelected={setSelected}
            />
          </Box>
        </Menu>
      </ProSidebar>
    </Box>
  );
};

export default Sidebar;