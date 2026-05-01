"use client";
import { useState, useRef, useEffect, ReactNode } from "react";
import {
  AppBar,
  Toolbar,
  Button,
  MenuItem,
  Box,
  Collapse,
  Paper,
  IconButton,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery,
  Typography,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Menu as MenuIcon,
  Close,
} from "@mui/icons-material";
import Link from "next/link";
import { usePathname } from "next/navigation";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface NavItem {
  text: string;
  icon?: ReactNode;
  path?: string;
  children?: NavItem[];
}

interface TopNavBarProps {
  navItems: NavItem[];
  logo?: ReactNode;
}

// ─── Desktop Dropdown ─────────────────────────────────────────────────────────

const DesktopDropdown = ({
  item,
  pathname,
}: {
  item: NavItem;
  pathname: string;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  // close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const isActive =
    item.path === pathname ||
    item.children?.some((c) => c.path === pathname);

  if (!item.children) {
    return (
      <Button
        component={Link}
        href={item.path ?? "#"}
        startIcon={item.icon}
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: isActive ? 700 : 500,
          color: isActive
            ? theme.palette.primary.main
            : theme.palette.text.primary,
          borderBottom: isActive
            ? `2px solid ${theme.palette.primary.main}`
            : "2px solid transparent",
          borderRadius: 0,
          px: 1.5,
          py: 0.75,
          "&:hover": {
            bgcolor: "transparent",
            borderBottom: `2px solid ${theme.palette.primary.light}`,
          },
        }}
      >
        {item.text}
      </Button>
    );
  }

  return (
    <Box ref={ref} sx={{ position: "relative" }}>
      <Button
        onClick={() => setOpen((p) => !p)}
        startIcon={item.icon}
        endIcon={open ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
        size="small"
        sx={{
          textTransform: "none",
          fontWeight: isActive ? 700 : 500,
          color: isActive
            ? theme.palette.primary.main
            : theme.palette.text.primary,
          borderBottom: isActive
            ? `2px solid ${theme.palette.primary.main}`
            : "2px solid transparent",
          borderRadius: 0,
          px: 1.5,
          py: 0.75,
          "&:hover": {
            bgcolor: "transparent",
            borderBottom: `2px solid ${theme.palette.primary.light}`,
          },
        }}
      >
        {item.text}
      </Button>

      {open && (
        <Paper
          elevation={4}
          sx={{
            position: "absolute",
            top: "100%",
            left: 0,
            minWidth: 200,
            zIndex: 1400,
            mt: 0.5,
            borderRadius: 1.5,
            overflow: "hidden",
            bgcolor: isDark ? "grey.900" : "background.paper",
          }}
        >
          {item.children.map((child) => {
            const childActive = child.path === pathname;
            return (
              <MenuItem
                key={child.path ?? child.text}
                component={child.path ? Link : "div"}
                href={child.path ?? undefined}
                onClick={() => setOpen(false)}
                selected={childActive}
                sx={{
                  gap: 1.5,
                  fontSize: 14,
                  fontWeight: childActive ? 700 : 400,
                  "&.Mui-selected": {
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.08)"
                      : "action.selected",
                  },
                  "&:hover": {
                    bgcolor: isDark
                      ? "rgba(255,255,255,0.06)"
                      : "action.hover",
                  },
                }}
              >
                {child.icon && (
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      color: childActive
                        ? "primary.main"
                        : "text.secondary",
                      "& svg": { fontSize: 18 },
                    }}
                  >
                    {child.icon}
                  </Box>
                )}
                {child.text}
              </MenuItem>
            );
          })}
        </Paper>
      )}
    </Box>
  );
};

// ─── Mobile Drawer ─────────────────────────────────────────────────────────────

const MobileNavDrawer = ({
  open,
  onClose,
  navItems,
  pathname,
}: {
  open: boolean;
  onClose: () => void;
  navItems: NavItem[];
  pathname: string;
}) => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const theme = useTheme();

  const toggle = (text: string) =>
    setExpanded((prev) => (prev === text ? null : text));

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{ sx: { width: 270 } }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          px: 2,
          py: 1.5,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="subtitle1" fontWeight={700}>
          القائمة
        </Typography>
        <IconButton onClick={onClose} size="small">
          <Close />
        </IconButton>
      </Box>

      <List disablePadding>
        {navItems.map((item) => (
          <Box key={item.text}>
            {item.children ? (
              <>
                <ListItemButton onClick={() => toggle(item.text)}>
                  {item.icon && (
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      {item.icon}
                    </ListItemIcon>
                  )}
                  <ListItemText primary={item.text} />
                  {expanded === item.text ? <ExpandLess /> : <ExpandMore />}
                </ListItemButton>

                <Collapse in={expanded === item.text} unmountOnExit>
                  <List disablePadding>
                    {item.children.map((child) => (
                      <ListItemButton
                        key={child.path ?? child.text}
                        component={child.path ? Link : "div"}
                        href={child.path ?? undefined}
                        onClick={onClose}
                        selected={child.path === pathname}
                        sx={{ pl: 4 }}
                      >
                        {child.icon && (
                          <ListItemIcon sx={{ minWidth: 32 }}>
                            {child.icon}
                          </ListItemIcon>
                        )}
                        <ListItemText
                          primary={child.text}
                          primaryTypographyProps={{ fontSize: 14 }}
                        />
                      </ListItemButton>
                    ))}
                  </List>
                </Collapse>
              </>
            ) : (
              <ListItemButton
                component={item.path ? Link : "div"}
                href={item.path ?? undefined}
                onClick={onClose}
                selected={item.path === pathname}
              >
                {item.icon && (
                  <ListItemIcon sx={{ minWidth: 36 }}>
                    {item.icon}
                  </ListItemIcon>
                )}
                <ListItemText primary={item.text} />
              </ListItemButton>
            )}
            <Divider />
          </Box>
        ))}
      </List>
    </Drawer>
  );
};

// ─── Main Component ────────────────────────────────────────────────────────────

const TopNavBar = ({ navItems, logo }: TopNavBarProps) => {
  const pathname = usePathname();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <AppBar
        position="sticky"
        elevation={1}
        sx={{
          bgcolor: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Toolbar
          variant="dense"
          sx={{
            minHeight: { xs: 48, sm: 52 },
            gap: 0.5,
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Mobile hamburger */}
          {isMobile && (
            <IconButton
              size="small"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo slot */}
          {logo && (
            <Box sx={{ mr: 2, display: "flex", alignItems: "center" }}>
              {logo}
            </Box>
          )}

          {/* Desktop nav items */}
          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "stretch", gap: 0.25, flexWrap: "wrap" }}>
              {navItems.map((item) => (
                <DesktopDropdown key={item.text} item={item} pathname={pathname} />
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {/* Mobile drawer */}
      <MobileNavDrawer
        open={mobileOpen}
        onClose={() => setMobileOpen(false)}
        navItems={navItems}
        pathname={pathname}
      />
    </>
  );
};

export default TopNavBar;
