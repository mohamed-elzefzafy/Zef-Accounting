
import { Box, Typography } from "@mui/material";

export default function Page() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ display: "flex", flex: 1 }}>
        {/* Sidebar already handles navigation with router.push */}

        <Box component="main" sx={{ flex: 1, p: 3 }}>
          <Typography variant="h4">Dashboard</Typography>
          <Typography>
            Welcome to Zef Accounting (demo). Use the sidebar to navigate.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
