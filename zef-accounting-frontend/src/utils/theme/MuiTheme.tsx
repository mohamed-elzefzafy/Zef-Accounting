"use client";
import { createContext, useState, useMemo, useEffect } from "react";
import { createTheme, Theme, PaletteOptions } from "@mui/material/styles";
import { deepPurple, grey } from "@mui/material/colors";

type Mode = "light" | "dark";

// Extend MUI's Palette
declare module "@mui/material/styles" {
  interface Palette {
    neutral: { main: string };
    favColor: { main: string };
    myColor: { main: string };
    bg: { main: string };
    appbarColor?: { main: string };
    mainColor?: { main: string };
  }

  interface PaletteOptions {
    neutral?: { main: string };
    favColor?: { main: string };
    myColor?: { main: string };
    bg?: { main: string };
    appbarColor?: { main: string };
    mainColor?: { main: string };
  }
}

export const getDesignTokens = (mode: Mode): PaletteOptions => ({
  mode,
  ...(mode === "light"
    ? {
        text: { primary: "#2B3445" },
        neutral: { main: "#64748B" },
        favColor: { main: grey[300] },
        myColor: { main: "#F6F9FC" },
        bg: { main: "#F6F6F6" },
        appbarColor: { main: deepPurple[800] },
        mainColor: { main: deepPurple[800] },
      }
    : {
        text: { primary: "#fff" },
        neutral: { main: "#64748B" },
        favColor: { main: grey[800] },
        myColor: { main: "#252b32" },
        bg: { main: "#1D2021" },
        appbarColor: { main: "#121212" },
        mainColor: { main: deepPurple[400] },
      }),
});

interface ColorModeContextType {
  toggleColorMode: () => void;
}

export const ColorModeContext = createContext<ColorModeContextType>({
  toggleColorMode: () => {},
});

export const useMode = (): [Theme, ColorModeContextType] => {
  const [mode, setMode] = useState<Mode>("light");

  useEffect(() => {
    const storedMode = localStorage.getItem("mode") as Mode;
    if (storedMode === "light" || storedMode === "dark") {
      setMode(storedMode);
    }
  }, []);

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prev) => {
          const nextMode = prev === "light" ? "dark" : "light";
          localStorage.setItem("mode", nextMode);
          return nextMode;
        });
      },
    }),
    []
  );

  const theme = useMemo(() => createTheme({ palette: getDesignTokens(mode) }), [mode]);

  return [theme, colorMode];
};
