import { Box, Typography, useTheme } from "@mui/material";
import { tokens } from "../theme";

import React from 'react'

const Header = ({title, subtitle}) => {
    const theme = useTheme();
    const colors = tokens(theme.palette.mode)
  return (
    <Box mb="30px">
        <Typography variant="h2" color={colors.grey[100]} fontWeight="400" sx={{mb:"5"}}>{title}</Typography>
        <Typography variant="h5" color={colors.greenAccent[200]}>{subtitle}</Typography>
    </Box>
  )
}

export default Header;