import { createTheme } from "@mui/material/styles";
export const MuiTheme = createTheme({
    palette: {
        mode: "light",
    },
    typography: {
        fontSize: 30,
    },
    components: {
        MuiDataGrid: {
            styleOverrides: {
                root: {
                    border: "none",
                    backgroundColor: "#FFFFFF",
                    color: "#191919",
                    padding: 10,
                },
            },
        },
    },
});
