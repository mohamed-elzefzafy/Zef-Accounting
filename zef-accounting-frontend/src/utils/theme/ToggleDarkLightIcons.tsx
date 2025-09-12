"use client";
import { DarkModeOutlined, LightModeOutlined } from "@mui/icons-material";
import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "./MuiTheme";

type TProps = {
  fontSize : string;  
}
const ToggleDarkLightIcons = ({fontSize} : TProps) => {
  const theme = useTheme();
const colorMode = useContext(ColorModeContext);
  return (
    <Box sx={{color : "#fff"}}>
    {theme.palette.mode === "light" ? (
      <IconButton
        onClick={() => {
          localStorage.setItem(
            "mode",
            theme.palette.mode === "dark" ? "light" : "dark"
          );
          colorMode.toggleColorMode();
        }}
        color="inherit"
      >
      
        <DarkModeOutlined  sx={{ fontSize: fontSize }} />
      </IconButton>
    ) : (
      <IconButton
        onClick={() => {
          localStorage.setItem(
            "mode",
            theme.palette.mode === "dark" ? "light" : "dark"
          );
          colorMode.toggleColorMode();
        }}
        color="inherit"
      >
        <LightModeOutlined sx={{ fontSize: fontSize }} />
      </IconButton>
    )}
  </Box>
  )
}

export default ToggleDarkLightIcons