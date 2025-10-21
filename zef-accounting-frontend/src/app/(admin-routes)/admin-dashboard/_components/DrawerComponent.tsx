"use client";
import { styled, useTheme, Theme, CSSObject } from "@mui/material/styles";
import MuiDrawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useEffect, useState , ReactNode } from "react";
import { grey } from "@mui/material/colors";
import { Tooltip } from "@mui/material";
import Link from "next/link";
import { usePathname } from "next/navigation";


const drawerWidth = 240;
const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

interface CustomDrawerProps{
  drawerOptions : {text: string , icon: ReactNode , path: string}[]
}

const DrawerComponent = ({drawerOptions} : CustomDrawerProps) => {
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));
  const [open, setOpen] = useState(isLargeScreen);
  const pathname = usePathname();
  console.log(location.pathname.split("-")[1]);

  useEffect(() => {
    setOpen(isLargeScreen);
  }, [isLargeScreen]);


  const isUpToMedium = useMediaQuery(theme.breakpoints.down("md"));

  
  return (
    <Drawer
      variant="permanent"
      open={open}
      sx={{
        "& .MuiDrawer-paper": {
          height: "calc(100vh - 66px)",
          position: "fixed",
          top :{xs : "48px" , sm :"64px"},
          zIndex : "1000",
        },
      }}
    >
      <Divider />
      <List sx={{ mt: 0, pt: 0 , width : "100%"}}>
        {drawerOptions?.map((item) => (
     <Tooltip title={isUpToMedium ? item.text : ""} placement="right-end" key={item.path} enterDelay={200}>
           <ListItem
            disablePadding
            component={Link}
            href={item.path}
          >
            <ListItemButton
              sx={{
                bgcolor:
                  pathname === item.path
                    ? theme.palette.mode === "dark"
                      ? grey[800]
                      : grey[300]
                    : null,
              }}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
     </Tooltip>
        ))}
      </List>
    </Drawer>
  );
};

export default DrawerComponent;
