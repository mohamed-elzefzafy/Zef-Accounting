// import React from 'react';
// import AppBar from '@mui/material/AppBar';
// import Toolbar from '@mui/material/Toolbar';
// import Typography from '@mui/material/Typography';
// import IconButton from '@mui/material/IconButton';
// import AccountCircle from '@mui/icons-material/AccountCircle';
// import Box from '@mui/material/Box';

// export function TopNav(){
//   return (
//     <AppBar position="static" color="primary">
//       <Toolbar>
//         <Typography variant="h6">Zef Accounting</Typography>
//         <Box sx={{ flexGrow: 1 }} />
//         <IconButton color="inherit"><AccountCircle /></IconButton>
//       </Toolbar>
//     </AppBar>
//   );
// }




"use client";
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import { AccountCircle } from "@mui/icons-material";
import ToggleDarkLightIcons from "@/utils/theme/ToggleDarkLightIcons";

export function TopNav() {
  return (
    <AppBar
      position="fixed" // 👈 بدل static
      color="primary"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }} // 👈 يخليها فوق السايدبار
    >
      <Toolbar>
        <Typography variant="h6" noWrap>
          Zef Accounting
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
            {/* Theme Toggle */}
            <ToggleDarkLightIcons fontSize="20px" />
        <IconButton color="inherit"><AccountCircle /></IconButton>
      </Toolbar>
    </AppBar>
  );
}
