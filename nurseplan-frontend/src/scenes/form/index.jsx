// Importazione di componenti e librerie necessarie
import { Box, Button, TextField } from "@mui/material"; // Componenti UI di Material-UI
import { Formik } from "formik"; // Gestione del modulo con Formik
import * as yup from "yup"; // Convalida del modulo con Yup
import useMediaQuery from "@mui/material/useMediaQuery"; // Hook per la gestione dei media query
import Header from "../../components/Header"; // Componente personalizzato per il titolo e sottotitolo
import AddCircleOutlinedIcon from '@mui/icons-material/AddCircleOutlined';

// Definizione del componente principale
const Form = () => {
  // Verifica se la larghezza dello schermo è maggiore di 600px
  // Serve per rendere il layout reattivo
  const isNonMobile = useMediaQuery("(min-width:600px)");

  // Funzione chiamata al momento dell'invio del modulo
  const handleFormSubmit = (values) => {
    console.log(values); // Stampa i valori del modulo nella console
  };

  return (
    <Box m="20px"> {/* Layout principale con margine di 20px */}
      <Header title="ACCOUNT" subtitle="Crea un nuovo account" /> {/* Titolo e sottotitolo */}

      <Formik
        onSubmit={handleFormSubmit} // Funzione eseguita al submit
        initialValues={initialValues} // Valori iniziali del modulo
        validationSchema={checkoutSchema} // Schema di convalida con Yup
      >
        {({
          values, // Contiene i valori dei campi
          errors, // Contiene gli errori di convalida
          touched, // Tiene traccia dei campi visitati dall'utente
          handleBlur, // Funzione chiamata quando un campo perde il focus
          handleChange, // Funzione chiamata al cambio di valore di un campo
          handleSubmit, // Funzione chiamata al submit del modulo
        }) => (
          <form onSubmit={handleSubmit}> {/* Modulo avvolto da Formik */}
            <Box
              display="grid" // Disposizione a griglia
              gap="30px" // Distanza tra gli elementi della griglia
              gridTemplateColumns="repeat(4, minmax(0, 1fr))" // Griglia con 4 colonne
              sx={{
                "& > div": { gridColumn: isNonMobile ? undefined : "span 4" }, // Adatta i campi agli schermi mobili
              }}
            >
              {/* Template Campo: Nome */}
              <TextField
                fullWidth // Campo che occupa tutta la larghezza disponibile
                variant="filled" // Stile del campo (Material-UI)
                type="text" // Tipo di input
                label="Nome" // Etichetta del campo
                onBlur={handleBlur} // Gestione dell'evento blur
                onChange={handleChange} // Gestione del cambiamento di valore
                value={values.firstName} // Valore del campo
                name="firstName" // Nome associato al campo
                error={!!touched.firstName && !!errors.firstName} // Mostra errore se il campo è stato toccato ed è invalido
                helperText={touched.firstName && errors.firstName} // Testo di aiuto in caso di errore
                sx={{ gridColumn: "span 2" }} // Campo che occupa 2 colonne nella griglia
              />
              {/* Campo: Cognome */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Cognome"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.lastName}
                name="lastName"
                error={!!touched.lastName && !!errors.lastName}
                helperText={touched.lastName && errors.lastName}
                sx={{ gridColumn: "span 2" }}
              />
              {/* Campo: Email */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Email"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.email}
                name="email"
                error={!!touched.email && !!errors.email}
                helperText={touched.email && errors.email}
                sx={{ gridColumn: "span 4" }}
              />
              {/* Campo: Numero di contatto */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Telefono"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.contact}
                name="contact"
                error={!!touched.contact && !!errors.contact}
                helperText={touched.contact && errors.contact}
                sx={{ gridColumn: "span 4" }}
              />
              {/* Campo: Indirizzo 1 */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Residenza"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address1}
                name="address1"
                error={!!touched.address1 && !!errors.address1}
                helperText={touched.address1 && errors.address1}
                sx={{ gridColumn: "span 4" }}
              />
              {/* Campo: Indirizzo 2 */}
              <TextField
                fullWidth
                variant="filled"
                type="text"
                label="Domicilio"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.address2}
                name="address2"
                error={!!touched.address2 && !!errors.address2}
                helperText={touched.address2 && errors.address2}
                sx={{ gridColumn: "span 4" }}
              />
            </Box>
            <Box display="flex" justifyContent="end" mt="20px"> {/* Pulsante di submit posizionato a destra */}
              <Button type="submit" color="secondary" variant="contained">
                <AddCircleOutlinedIcon/>
              </Button>
            </Box>
          </form>
        )}
      </Formik>
    </Box>
  );
};

// Espressione regolare per validare numeri di telefono
const phoneRegExp =
  /^((\+[1-9]{1,4}[ -]?)|(\([0-9]{2,3}\)[ -]?)|([0-9]{2,4})[ -]?)*?[0-9]{3,4}[ -]?[0-9]{3,4}$/;

// Schema di convalida con Yup
const checkoutSchema = yup.object().shape({
  firstName: yup
  .string()
  .matches(/^[a-zA-Z\s]+$/, "First name must contain only letters")//validazione nome
  .required("required"), // Nome obbligatorio
  lastName: yup.string()
  .matches(/^[a-zA-Z\s]+$/, "Last name must contain only letters")//validazione cognome
  .required("required"), // Cognome obbligatorio
  email: yup
  .string()
  .email("invalid email")
  .required("required"), // Email valida obbligatoria
  contact: yup
    .string()
    .matches(phoneRegExp, "Phone number is not valid") // Numero di telefono valido
    .required("required"), // Campo obbligatorio
  address1: yup.string().required("required"), // Indirizzo 1 obbligatorio
  address2: yup.string().required("required"), // Indirizzo 2 obbligatorio
});

// Valori iniziali del modulo
const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  address1: "",
  address2: "",
};

// Esportazione del componente
export default Form;
