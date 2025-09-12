"use client";
import { ReactNode } from 'react';
import {  Category, Dashboard, Group, Note, Reviews, School} from '@mui/icons-material';
import { Box } from '@mui/material';
import DrawerComponent from './_components/DrawerComponent';
import { TopNav } from './_components/TopNav';




const InstructorDashboardLayout = ({ children }: { children: ReactNode }) => {


  const InstructorDashboardArrayList = [
  { text:"Dashboard", icon: <Dashboard />, path: "/" },
  { text: "Courses", icon: <School/>, path: "/journal" },
  { text: "Categories", icon: <Category/>, path: "/ledger" },
  { text: "Users", icon: <Group />, path: "/admin-dashboard/users" },
  { text: "Reviews", icon: <Reviews />, path: "/admin-dashboard/reviews" },
  { text: "Instructor request", icon: <Note />, path: "/admin-dashboard/instructor-request" },
];


  return (
    <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
      <TopNav/>
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