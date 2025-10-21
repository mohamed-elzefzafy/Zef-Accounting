"use client";
import { useCreateCategoryMutation } from "@/redux/slices/api/categoryApiSlice";
import { IAddCategory } from "@/types/category";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Box } from "@mui/system";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageIcon from "@mui/icons-material/Image";
import { ChangeEvent, useState } from "react";


const AddCategoryAdminPage = () => {
  const router = useRouter();
  const [createCategory] = useCreateCategoryMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<IAddCategory>();

  const onSubmit = async (values: IAddCategory) => {
    
    try {
            const formData = new FormData();
      formData.append("title", values.title);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createCategory(formData).unwrap();

      toast.success("you have created category successfully");
      reset();
      setTimeout(() => {
        router.push(`/admin-dashboard/categories`);
      }, 1000);
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };

    const handleImageFile = (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
        setImageFile(e.target.files[0]);
      }
    };

  return (
    <Stack
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      sx={{
        width: { xs: "70%", md: "40%" },
        mx: "auto",
        height: { xs: "calc(100vh - 8rem)", sm: "calc(100vh - 9rem)" },
        mt: 10,
        display: "flex",
        alignItems: "center",
        justifyItems: "center",
        justifyContent: "flex-start",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="h2" sx={{ ml: 2 }}>
      Add category
        <Tooltip
          title={"back to Categories admin dashboard"}
          placement="right-end"
          enterDelay={200}
        >
          <IconButton
            onClick={() => router.push(`/admin-dashboard/categories`)}
          >
            <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Typography>
      <TextField
        type="text"
        placeholder="title"
        label="title"
        sx={{ width: "100%" }}
        {...register("title", { required: "title is required" })}
        error={errors.title ? true : false}
        helperText={errors.title && "title is required"}
      />

      {/* <Button
        type="submit"
        variant="contained"
        color="primary"
        sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
        disabled={isSubmitting}
      >
        Add category 
      </Button> */}

            {imageFile && (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Image
                  src={URL.createObjectURL(imageFile)}
                  width={200}
                  height={200}
                  style={{ objectFit: "contain", borderRadius: "5px" }}
                  alt="profileImage"
                />
              </Box>
            )}
      
            <Button
              component="label"
              variant="outlined"
              fullWidth
              sx={{ textTransform: "capitalize" }}
              startIcon={<ImageIcon />}
            >
              {imageFile ? "category image selected" : "Upload category image"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageFile}
              />
            </Button>
      
            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={isSubmitting}
              sx={{ textTransform: "capitalize", position: "relative" }}
            >
              {isSubmitting ? (
                <CircularProgress
                  size={24}
                  sx={{
                    color: "white",
                  }}
                />
              ) : (
                "Add category "
              )}
            </Button>
    </Stack>
  );
};

export default AddCategoryAdminPage;
