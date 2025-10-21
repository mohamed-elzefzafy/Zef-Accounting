"use client";
import { ReactNode } from 'react';
import {  Category, Dashboard, Group, Note, Reviews, School} from '@mui/icons-material';
import { Box } from '@mui/material';
import DrawerComponent from './_components/DrawerComponent';
import { TopNav } from './_components/TopNav';
import Header from '../components/Header';




const InstructorDashboardLayout = ({ children }: { children: ReactNode }) => {


  const InstructorDashboardArrayList = [
  { text:"Dashboard", icon: <Dashboard />, path: "/accounting-department" },
  { text: "Create Journal Entry", icon: <School/>, path: "/accounting-department/journal" },
  { text: "General Ledger", icon: <Category/>, path: "/accounting-department/ledger" },
];


  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      {/* <TopNav/> */}
      <Header/>
  <DrawerComponent drawerOptions={InstructorDashboardArrayList} />

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