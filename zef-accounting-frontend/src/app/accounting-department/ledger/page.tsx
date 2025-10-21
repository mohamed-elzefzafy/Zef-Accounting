"use client";
import { Box } from "@mui/material";
import { LedgerAccountView } from "../_components/LedgerAccountView";

export default function LedgerPage() {
  return (
    <Box sx={{ display: "flex" }}>
      <Box component="main" sx={{ flex: 1, p: 3 }}>
        <LedgerAccountView />
      </Box>
    </Box>
  );
}
