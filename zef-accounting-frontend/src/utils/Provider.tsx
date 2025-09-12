"use client";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { Box, ThemeProvider } from "@mui/material";
import { PersistGate } from "redux-persist/integration/react";
import { ReactNode } from "react";
import { ColorModeContext, useMode } from "./theme/MuiTheme";
import { Toaster } from "react-hot-toast";
import { Provider } from "react-redux";
import store, { persistor } from "@/redux/store";
// import Header from "@/app/components/Header";
// import Footer from "@/app/components/Footer";



interface ProviderProps {
  children: ReactNode[];
}

export default function Providers({ children }: ProviderProps) {
  const [theme, colorMode] = useMode();
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppRouterCacheProvider>
          <ColorModeContext.Provider value={colorMode}>
            <Toaster />
            <ThemeProvider theme={theme}>
              <Box sx={{ bgcolor: theme.palette.bg.main }}>
                {/* <Header /> */}
                <Box
                  sx={{
                    mt: {
                      xs: "48px",
                      sm: "64px"
                    },
                      minHeight: {
                        xs: "calc(100vh - 120px)",
                        sm: "calc(100vh - 138px)",
                      },
                  }}
                >
                  {children}
                </Box>
                {/* <Footer /> */}
              </Box>
            </ThemeProvider>
          </ColorModeContext.Provider>
        </AppRouterCacheProvider>
      </PersistGate>
    </Provider>
  );
}