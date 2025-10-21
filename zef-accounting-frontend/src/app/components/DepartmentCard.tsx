"use client";
import { Card, CardContent, CardMedia, Typography } from "@mui/material";
import { useRouter } from "next/navigation";
const DepartmentCard = ({ url, title,imageUrl }: { url: string; title: string ,imageUrl:string}) => {
  const router = useRouter();
  return (
    <Card
      sx={{
        maxWidth: 300,
        width: "100%",
        borderRadius: 3,
        boxShadow: 4,
        transition: "0.3s",
        "&:hover": { boxShadow: 8, transform: "translateY(-4px)" },
      }}
    >
      {/* Product Image */}
      {/* <CardMedia
        component="img"
        height="200"
        image={imageUrl}
        alt={title}
        sx={{
          objectFit: "cover",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          cursor: "pointer",
        }}
        onClick={() => router.push(url)}
      /> */}

      <CardMedia
  component="img"
  height="200"
  image={imageUrl}
  alt={title}
  sx={(theme) => ({
    objectFit: "contain", // بدل cover علشان اللوجو يبان كله
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    cursor: "pointer",
    p: 2, // padding حوالين الصورة
    bgcolor: theme.palette.mode === "dark" ? "#fff" : "#f5f5f5", // خلفية مختلفة للـ Light/Dark mode
  })}
  onClick={() => router.push(url)}
/>

      <CardContent>
        {/* Title */}
        <Typography
          variant="h6"
          fontWeight="bold"
          noWrap
          sx={{ mb: 0.5, cursor: "pointer" }}
          onClick={() => router.push(url)}
        >
          {title}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default DepartmentCard;
