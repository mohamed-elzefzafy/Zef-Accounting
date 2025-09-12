// import React from 'react';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// export function Sidebar({ onNavigate }: { onNavigate: (p: string) => void }){
//   return (
//     <Drawer variant="permanent" open>
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => onNavigate('/')}>
//             <ListItemIcon><DashboardIcon /></ListItemIcon>
//             <ListItemText primary="Dashboard" />
//           </ListItemButton>
//         </ListItem>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => onNavigate('/journal')}>
//             <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
//             <ListItemText primary="Journal Entries" />
//           </ListItemButton>
//         </ListItem>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => onNavigate('/ledger')}>
//             <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
//             <ListItemText primary="General Ledger" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// }



// // Sidebar.tsx
// import React from 'react';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// export const drawerWidth = 240; // 👈 ثابت العرض

// export function Sidebar({ onNavigate }: { onNavigate: (p: string) => void }) {
//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
//       }}
//       open
//     >
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => onNavigate('/')}>
//             <ListItemIcon><DashboardIcon /></ListItemIcon>
//             <ListItemText primary="Dashboard" />
//           </ListItemButton>
//         </ListItem>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => onNavigate('/journal')}>
//             <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
//             <ListItemText primary="Journal Entries" />
//           </ListItemButton>
//         </ListItem>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => onNavigate('/ledger')}>
//             <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
//             <ListItemText primary="General Ledger" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// }






// "use client";

// import React from 'react';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
// import { useRouter } from 'next/navigation';

// export function Sidebar() {
//   const router = useRouter();

//   return (
//     <Drawer variant="permanent" open>
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => router.push('/')}>
//             <ListItemIcon><DashboardIcon /></ListItemIcon>
//             <ListItemText primary="Dashboard" />
//           </ListItemButton>
//         </ListItem>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => router.push('/journal')}>
//             <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
//             <ListItemText primary="Journal Entries" />
//           </ListItemButton>
//         </ListItem>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => router.push('/ledger')}>
//             <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
//             <ListItemText primary="General Ledger" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// }



// "use client";

// import Drawer from "@mui/material/Drawer";
// import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
// import ListItemButton from "@mui/material/ListItemButton";
// import ListItemIcon from "@mui/material/ListItemIcon";
// import ListItemText from "@mui/material/ListItemText";
// import DashboardIcon from "@mui/icons-material/Dashboard";
// import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";
// import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
// import { useRouter } from "next/navigation";

// export const drawerWidth = 240; // 👈 ثابت العرض
// export function Sidebar() {
//   const router = useRouter();

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: 240,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
//       }}
//     >
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => router.push("/")}>
//             <ListItemIcon>
//               <DashboardIcon />
//             </ListItemIcon>
//             <ListItemText primary="Dashboard" />
//           </ListItemButton>
//         </ListItem>

//         <ListItem disablePadding>
//           <ListItemButton onClick={() => router.push("/journal")}>
//             <ListItemIcon>
//               <ReceiptLongIcon />
//             </ListItemIcon>
//             <ListItemText primary="Journal Entries" />
//           </ListItemButton>
//         </ListItem>

//         <ListItem disablePadding>
//           <ListItemButton onClick={() => router.push("/ledger")}>
//             <ListItemIcon>
//               <AccountBalanceIcon />
//             </ListItemIcon>
//             <ListItemText primary="General Ledger" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// }



// "use client";

// import { useRouter } from "next/navigation";
// import { Drawer, List, ListItem, ListItemButton, ListItemText } from "@mui/material";

// export const drawerWidth = 240;

// export function Sidebar() {
//   const router = useRouter();

//   const handleNavigate = (path: string) => {
//     router.push(path);
//   };

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: "border-box" },
//       }}
//     >
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => handleNavigate("/")}>
//             <ListItemText primary="Home" />
//           </ListItemButton>
//         </ListItem>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => handleNavigate("/ledger")}>
//             <ListItemText primary="Ledger" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// }







// 'use client';
// import { useRouter } from 'next/navigation';
// import Drawer from '@mui/material/Drawer';
// import List from '@mui/material/List';
// import ListItem from '@mui/material/ListItem';
// import ListItemButton from '@mui/material/ListItemButton';
// import ListItemIcon from '@mui/material/ListItemIcon';
// import ListItemText from '@mui/material/ListItemText';
// import DashboardIcon from '@mui/icons-material/Dashboard';
// import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
// import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// export const drawerWidth = 240;

// export function Sidebar() {
//   const router = useRouter();

//   const handleNavigate = (path: string) => {
//     router.push(path);
//   };

//   return (
//     <Drawer
//       variant="permanent"
//       sx={{
//         width: drawerWidth,
//         flexShrink: 0,
//         [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
//       }}
//     >
//       <List>
//         <ListItem disablePadding>
//           <ListItemButton onClick={() => handleNavigate('/')}>
//             <ListItemIcon><DashboardIcon /></ListItemIcon>
//             <ListItemText primary="Dashboard" />
//           </ListItemButton>
//         </ListItem>

//         <ListItem disablePadding>
//           <ListItemButton onClick={() => handleNavigate('/journal')}>
//             <ListItemIcon><ReceiptLongIcon /></ListItemIcon>
//             <ListItemText primary="Journal Entries" />
//           </ListItemButton>
//         </ListItem>

//         <ListItem disablePadding>
//           <ListItemButton onClick={() => handleNavigate('/ledger')}>
//             <ListItemIcon><AccountBalanceIcon /></ListItemIcon>
//             <ListItemText primary="General Ledger" />
//           </ListItemButton>
//         </ListItem>
//       </List>
//     </Drawer>
//   );
// }



// "use client";
// import { ReactNode } from 'react';
// import {  Category, Dashboard, Group, LocalLibrary, Note, Reviews, School} from '@mui/icons-material';
// import { Box } from '@mui/material';
// import DrawerComponent from './DrawerComponent';




// const InstructorDashboardLayout = ({ children }: { children: ReactNode }) => {


//   const InstructorDashboardArrayList = [
//   { text:"Dashboard", icon: <Dashboard />, path: "/admin-dashboard" },
//   { text: "Courses", icon: <School/>, path: "/admin-dashboard/courses" },
//   { text: "Categories", icon: <Category/>, path: "/admin-dashboard/categories" },
//   { text: "Users", icon: <Group />, path: "/admin-dashboard/users" },
//   { text: "Reviews", icon: <Reviews />, path: "/admin-dashboard/reviews" },
//   { text: "Instructor request", icon: <Note />, path: "/admin-dashboard/instructor-request" },
// ];


//   return (
//     <Box sx={{ display: 'flex', width: '100%', minHeight: '100vh' }}>
//   <DrawerComponent drawerOptions={InstructorDashboardArrayList} />

//   <Box
//     component="main"
//     sx={{
//       flexGrow: 1,            // this makes sure the main content takes remaining space
//       overflowX: 'hidden',    // optional: prevents horizontal scroll
//       overflowY: 'auto',      // optional: allow vertical scrolling
//       maxWidth: '100%',       // prevents growing too wide
//     }}
//   >
//     {children}
//   </Box>
// </Box>

//   );
// };

// export default InstructorDashboardLayout;