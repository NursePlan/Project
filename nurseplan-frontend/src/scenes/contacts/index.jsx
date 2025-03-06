import { Box } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { mockDataContacts } from "../../data/mockData";
import { tokens } from "../../theme";
import Header from "../../components/Header";
import { useTheme } from "@mui/material"

const Contacts = () => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode);

    const columns = [
        {
            field: 'id',
            headerName: 'ID',
        },
        {
            field: "registrarId",
            headerName: "Registrar ID",
        },
        {
            field: 'name',
            headerName: 'Name',
            flex: 1,
            cellClassName: 'name-column--cell',

        },
        {
            field: 'age',
            headerName: 'Age',
            type: "number",
            headerAlign: "left",
            align: "left",

        },
        {
            field: 'phone',
            headerName: 'Phone Number',
            flex: 1,
        },
        {
            field: 'email',
            headerName: 'Email',
            flex: 1,
        },
        {
            field: 'addess',
            headerName: 'Address',
            flex: 1,
        },
        {
            field: 'city',
            headerName: 'City',
            flex: 1,
        },
        {
            field: 'zipCode',
            headerName: 'ZipCode',
            flex: 1,
        },
        
    ]


    return (
        <Box m="20px" p="10px">

            <Header title="Anagrafica" subtitle="info  e contatti del team" />
            <Box
                m="40px 0 0 0"
                height="75vh"
                sx={{
                    "& .MuiDataGrid-root": {
                        border: "none",
                    },
                    "& .MuiDataGrid-cell": {
                        borderBottom: "none",
                        textAlign: "center",
                        alignContent: "center",
                    },
                    "& .name-column--cell": {
                        color: colors.greenAccent[300],
                    },
                    "& .MuiDataGrid-columnHeader": {
                        backgroundColor: colors.blueAccent[500],
                        borderBottom: "none",
                    },
                    "& .MuiDataGrid-columnHeaderTitleContainer": {
                        justifyContent: "center",
                    },

                    "& .MuiDataGrid-virtualScroller": {
                        backgroundColor: colors.primary[400],
                    },
                    "& .MuiDataGrid-footerContainer": {
                        borderTop: "none",
                        backgroundColor: colors.blueAccent[500],
                    },
                    "& .MuiCheckbox-root": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                    "& .MuiDataGrid-toolbarContainer .MuiButton-text": {
                        color: `${colors.greenAccent[200]} !important`,
                    },
                }}
            >
                <DataGrid
                    rows={mockDataContacts}/*i dati che verranno visualizzati nella tabella organizzati in righe*/
                    columns={columns}/* è la variabile che contiene le colonne della tabella*/components ={{toolbar: GridToolbar}}/*è la variabile che contiene le funzionalità della tabella*/
                />
            </Box>
        </Box>

    )
}

export default Contacts