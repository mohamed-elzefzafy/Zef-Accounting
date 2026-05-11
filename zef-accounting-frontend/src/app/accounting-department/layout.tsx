"use client";
import { ReactNode } from "react";
import {
  Category,
  Dashboard,
  School,
  AccountBalance,
  ReceiptLong,
  Assessment,
  Settings,
  Group,
} from "@mui/icons-material";
import { Box } from "@mui/material";
// import TopNavBar, { NavItem } from "./_components/TopNav";
import Header from "../components/Header";
import TopNavBar, { NavItem } from "./_components/TopNavBar";

const navItems: NavItem[] = [
  {
    text: "Dashboard",
    icon: <Dashboard />,
    path: "/accounting-department",
  },
  {
    text: "Journals",
    icon: <School />,
    children: [
      { text: "Create Journal Entry", icon: <School />, path: "/accounting-department/journal" },
      { text: "Journal List", icon: <ReceiptLong />, path: "/accounting-department/journal/list" },
    ],
  },
  {
    text: "Ledger",
    icon: <Category />,
    children: [
      { text: "General Ledger", icon: <Category />, path: "/accounting-department/ledger" },
      { text: "Trial Balance", icon: <AccountBalance />, path: "/accounting-department/ledger/trial-balance" },
    ],
  },
  {
    text: "Reports",
    icon: <Assessment />,
    children: [
      { text: "Income Statement", icon: <Assessment />, path: "/accounting-department/reports/income" },
      { text: "Balance Sheet", icon: <AccountBalance />, path: "/accounting-department/reports/balance-sheet" },
    ],
  },
  {
    text: "Users",
    icon: <Group />,
    path: "/accounting-department/users",
  },
  {
    text: "Settings",
    icon: <Settings />,
    path: "/accounting-department/settings",
  },
  {
    text: "Create Account",
    icon: <Settings />,
    path: "/accounting-department/create-account",
  },
  {
    text: "trail-balance",
    icon: <Settings />,
    path: "/accounting-department/trail-balance",
  },
];

const InstructorDashboardLayout = ({ children }: { children: ReactNode }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Header />
      <TopNavBar navItems={navItems} />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          overflowX: "hidden",
          overflowY: "auto",
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default InstructorDashboardLayout;
