import { ReactNode } from 'react';
import { Box } from '@mui/material';
import Header from '../components/Header';


const InstructorDashboardLayout = ({ children }: { children: ReactNode }) => {

  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <Header/>

  <Box
    component="main"
    sx={{
      flexGrow: 1,            // this makes sure the main content takes remaining space
      overflowX: 'hidden',    // optional: prevents horizontal scroll
      overflowY: 'auto',      // optional: allow vertical scrolling
      maxWidth: '100%',       // prevents growing too wide
    }}
  >
    {children}
  </Box>
</Box>

  );
};

export default InstructorDashboardLayout;