"use client";
import { ReactNode } from "react";
import {
  BrandingWatermark,
  Category,
  CurrencyExchange,
  Dashboard,
  Group,
  LocalLibrary,
  Note,
  PermMedia,
  Receipt,
  Reviews,
  School,
  TabletMac,
} from "@mui/icons-material";
import { Box } from "@mui/material";
import DrawerComponent from "./_components/DrawerComponent";

const InstructorDashboardLayout = ({ children }: { children: ReactNode }) => {
  const InstructorDashboardArrayList = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin-dashboard" },
    { text: "Products", icon: <TabletMac/>, path: "/admin-dashboard/products" },
    {
      text: "Categories",
      icon: <Category />,
      path: "/admin-dashboard/categories",
    },
    {
      text: "SubCategories",
      icon: <Category />,
      path: "/admin-dashboard/subcategories",
    },
    { text: "Brands", icon: <BrandingWatermark/>, path: "/admin-dashboard/brands" },
    { text: "Users", icon: <Group />, path: "/admin-dashboard/users" },
    { text: "Reviews", icon: <Reviews />, path: "/admin-dashboard/reviews" },
    {
      text: "orders",
      icon: <Receipt/>,
      path: "/admin-dashboard/orders",
    },
    {
      text: "banners",
      icon:<PermMedia/>,
      path: "/admin-dashboard/banners",
    },
    {
      text: "Tax shipping",
      icon:<CurrencyExchange/>,
      path: "/admin-dashboard/taxAndSipping",
    },
  ];

  return (
    <Box sx={{ display: "flex", width: "100%", minHeight: "100vh" }}>
      <DrawerComponent drawerOptions={InstructorDashboardArrayList} />

      <Box
        component="main"
        sx={{
          flexGrow: 1, // this makes sure the main content takes remaining space
          overflowX: "hidden", // optional: prevents horizontal scroll
          overflowY: "auto", // optional: allow vertical scrolling
          maxWidth: "100%", // prevents growing too wide
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default InstructorDashboardLayout;
