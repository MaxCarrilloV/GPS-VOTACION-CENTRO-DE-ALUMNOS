// src/routes/App.jsx

import React from "react";
import { Box, Typography } from "@mui/material";
import Avisos from "../components/Avisos";

function App() {
  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Inicio
      </Typography>
      <Avisos />
    </Box>
  );
}

export default App;
