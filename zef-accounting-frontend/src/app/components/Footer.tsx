import { Box, Typography, useTheme } from "@mui/material";

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        bgcolor:
          theme.palette.mode === "light"
            ? theme.palette.primary.main
            : "var(--AppBar-color)",
        py: 2,
        display: "flex",
        justifyContent: "center",
        width: "100%",
        zIndex: "1100",
        position: "relative",
        boxShadow: theme.shadows[10],
        mt: 2,
      }}
    >
      <Typography color="white" fontWeight="bold">
        Zef-Market &copy; {currentYear}
      </Typography>
    </Box>
  );
};

export default Footer;
