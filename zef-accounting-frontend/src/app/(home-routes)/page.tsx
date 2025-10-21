import { Container, Stack, Typography } from "@mui/material";
import DepartmentCard from "../components/DepartmentCard";

const HomePage = () => {
  const departmentArr = [
    { url: `/accounting-department`, title: "Accounting Department" ,imageUrl:"/images/Zef-Accounting.jpeg"},
  ];
  return (
    <Container sx={{ pt: 2 }}>
      <Typography sx={{my:3}}>HomePage</Typography>

      <Stack
        flexDirection={"row"}
        flexWrap={"wrap"}
        gap={4}
        justifyContent={"space-between"}
      >
        {departmentArr.map((department) => (
          <DepartmentCard
            title={department.title}
            url={department.url}
            imageUrl={department.imageUrl}
            key={department.url}
          />
        ))}
      </Stack>
    </Container>
  );
};

export default HomePage;
