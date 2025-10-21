// "use client";
// import { Paper, Typography, Box, Link, useTheme } from "@mui/material";
// import Grid from "@mui/material/Grid";
// import {
//   Book,
//   Category,
//   Comment,
//   Group,
//   LocalLibrary,
//   Note,
//   Reviews,
//   School,
// } from "@mui/icons-material";
// import { useAppSelector } from "@/redux/hooks";

// const AdminDashboardPaper = () => {
//   const theme = useTheme();

//   const data = [
//     {
//       label: "Courses",
//       icon: <School fontSize="large" color="primary" />,
//       path: "/admin-dashboard/courses",
//     },
//     {
//       label: "Categories",
//       icon: <Category fontSize="large" color="primary" />,
//       path: "/admin-dashboard/categories",
//     },
//     {
//       label: "Users",
//       icon: <Group fontSize="large" color="primary" />,
//       path: "/admin-dashboard/users",
//     },
//     {
//       label: "Reviews",
//       icon: <Reviews fontSize="large" color="primary" />,
//       path: "/admin-dashboard/reviews",
//     },
//     {
//       label: "Instructor request",
//       icon: <Note fontSize="large" color="primary" />,
//       path: "/admin-dashboard/instructor-request",
//     },
//   ];

//   return (
//     <>
//       <Typography variant="h4" sx={{ mb: 4 , ml:1, mt:1}}>
//         Admin dashboard 
//       </Typography>
//       <Grid container spacing={3}>
//         {data.map((item, index) => (
//           <Grid size={{ xs: 12, sm: 6 }} key={index} flexWrap="wrap">
//             <Paper
//               elevation={3}
//               sx={{
//                 p: 7,
//                 display: "flex",
//                 alignItems: "center",
//                 bgcolor:
//                   theme.palette.mode === "dark"
//                     ? "grey.900"
//                     : "background.paper",
//                 borderRadius: 2,
//                 transition: "all 0.3s ease-in-out",
//                 "&:hover": {
//                   transform: "translateY(-4px)",
//                   boxShadow: theme.shadows[10],
//                   bgcolor:
//                     theme.palette.mode === "dark"
//                       ? "grey.800"
//                       : "primary.light",
//                   "& .icon": {
//                     color:
//                       theme.palette.mode === "dark"
//                         ? "primary.contrastText"
//                         : "primary.dark",
//                   },
//                 },
//                 background:
//                   theme.palette.mode === "dark"
//                     ? `linear-gradient(45deg, ${theme.palette.grey[900]} 30%, ${theme.palette.grey[800]} 90%)`
//                     : `linear-gradient(45deg, ${theme.palette.background.paper} 30%, ${theme.palette.primary.light} 90%)`,
//               }}
//               component={Link}
//               href={item.path}
//             >
//               <Box sx={{ marginRight: 2 }}>{item.icon}</Box>
//               <Box>
//                 <Typography variant="h6" component="div" fontWeight={"bold"}>
//                   {item.label}
//                 </Typography>
//                 {/* <Typography variant="h4" component="div">
//                   {item.value}
//                 </Typography> */}
//               </Box>
//             </Paper>
//           </Grid>
//         ))}
//       </Grid>
//     </>
//   );
// };

// export default AdminDashboardPaper;
