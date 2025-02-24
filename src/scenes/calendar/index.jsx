import { useState } from "react"; // Importa useState per gestire lo stato del componente
import FullCalendar from "@fullcalendar/react"; // Importa il componente FullCalendar
import { formatDate } from "@fullcalendar/core"; // Importa la funzione formatDate per formattare le date
import dayGridPlugin from "@fullcalendar/daygrid"; // Importa il plugin per la vista a griglia giornaliera
import timeGridPlugin from "@fullcalendar/timegrid"; // Importa il plugin per la vista a griglia oraria
import interactionPlugin from "@fullcalendar/interaction"; // Importa il plugin per l'interazione (selezione, clic sugli eventi)
import listPlugin from "@fullcalendar/list"; // Importa il plugin per la vista lista degli eventi
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  useTheme,
  Button,
} from "@mui/material"; // Importa componenti da Material-UI per la UI
import Header from "../../components/Header"; // Importa un componente Header personalizzato
import { tokens } from "../../theme"; // Importa i token di tema per la gestione dei colori

const colorsList = [
  { name: "Mattina", value: "#f4a36b" },
  { name: "Pomeriggio", value: "#93b7d1" },
  { name: "Notte", value: "#0a70af" },
  { name: "Yellow", value: "#FFFF00" },
  { name: "Purple", value: "#800080" },
];

const Calendar = () => {
  const theme = useTheme(); // Ottiene il tema attuale
  const colors = tokens(theme.palette.mode); // Ottiene i colori in base al tema
  const [currentEvents, setCurrentEvents] = useState([]); // Stato per memorizzare gli eventi correnti
  const [selectedColor, setSelectedColor] = useState(colorsList[0].value); // Colore selezionato per l'evento

  // Funzione per gestire il clic su una data
  const handleDateClick = (selected) => {
    const title = prompt("Please enter a new title for your event"); // Chiede all'utente di inserire un titolo per l'evento
    const calendarApi = selected.view.calendar; // Ottiene l'API del calendario
    calendarApi.unselect(); // Deseleziona la data

    if (title) {
      // Se l'utente ha inserito un titolo
      calendarApi.addEvent({
        id: `${selected.dateStr}-${title}`, // Crea un ID unico per l'evento
        title, // Titolo dell'evento
        start: selected.startStr, // Data di inizio dell'evento
        end: selected.endStr, // Data di fine dell'evento
        allDay: selected.allDay, // Indica se l'evento è tutto il giorno
        backgroundColor: selectedColor, // Colore di sfondo dell'evento
        borderColor: selectedColor, // Colore del bordo dell'evento
      });
    }
  };

  // Funzione per gestire il clic su un evento
  const handleEventClick = (selected) => {
    if (
      window.confirm(
        `Are you sure you want to delete the event '${selected.event.title}'` // Chiede conferma per eliminare l'evento
      )
    ) {
      selected.event.remove(); // Rimuove l'evento dal calendario
    }
  };

  // Funzione per gestire il cambiamento di data di un evento
  const handleEventDrop = (info) => {
    const updatedEvent = {
      id: info.event.id,
      title: info.event.title,
      start: info.event.start,
      end: info.event.end,
      allDay: info.event.allDay,
      backgroundColor: info.event.backgroundColor, // Mantieni il colore dell'evento
      borderColor: info.event.borderColor, // Mantieni il colore del bordo
    };

    // Aggiorna lo stato degli eventi correnti
    setCurrentEvents(( prevEvents) =>
      prevEvents.map((event) => (event.id === updatedEvent.id ? updatedEvent : event))
    );
  };

  return (
    <Box m="20px"> {/* Contenitore principale con margine */}
      <Header title="Calendar" subtitle="Full Calendar Interactive Page" /> {/* Intestazione del calendario */}

      <Box display="flex" justifyContent="space-between"> {/* Contenitore flessibile per il sidebar e il calendario */}
        {/* CALENDAR SIDEBAR */}
        <Box
          flex="1 1 20%" // Imposta la larghezza del sidebar
          backgroundColor={colors.primary[400]} // Colore di sfondo del sidebar
          p="15px" // Padding interno
          borderRadius="4px" // Angoli arrotondati
        >
          <Typography variant="h5">Events</Typography> {/* Titolo della sezione eventi */}
          <List>
            {currentEvents.map((event) => ( // Mappa gli eventi correnti
              <ListItem
                key={event.id} // Chiave unica per ogni elemento della lista
                sx={{
                  backgroundColor: event.backgroundColor, // Colore di sfondo per l'elemento della lista
                  margin: "10px 0", // Margine verticale
                  borderRadius: "2px", // Angoli arrotondati
                }}
              >
                <ListItemText
                  primary={event.title} // Titolo dell'evento
                  secondary={
                    <Typography>
                      {formatDate(event.start, { // Formatta la data di inizio
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} - {formatDate(event.end, {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })} 
                    </Typography>
                  }
                />
              </ListItem>
            ))}
          </List>
          <Typography variant="h6">Select Event Color:</Typography>
          <Box display="flex" flexDirection="column">
            {colorsList.map((color) => (
              <Button
                key={color.name}
                onClick={() => setSelectedColor(color.value)} // Imposta il colore selezionato
                sx={{
                  backgroundColor: color.value,
                  color: '#fff',
                  margin: '5px 0',
                }}
              >
                {color.name}
              </Button>
            ))}
          </Box>
        </Box>

        {/* CALENDAR */}
        <Box flex="1 1 75%" ml="20px"> {/* Imposta la larghezza del calendario */}
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin]} // Includi i plugin necessari
            headerToolbar={{
              left: "prev,next today", // Pulsanti di navigazione
              center: "title", // Titolo del calendario
              right: "dayGridMonth,timeGridWeek,timeGridDay,listWeek", // Viste disponibili
            }}
            initialView="dayGridMonth" // Vista iniziale
            editable={true} // Abilita l'editing
            selectable={true} // Abilita la selezione
            select={handleDateClick} // Gestore per il clic su una data
            eventClick={handleEventClick} // Gestore per il clic su un evento
            eventDrop={handleEventDrop} // Gestore per il drag and drop degli eventi
            events={currentEvents} // Passa gli eventi correnti al calendario
          />
        </Box>
      </Box>
    </Box>
  );
};

export default Calendar; // Esporta il componente Calendar
