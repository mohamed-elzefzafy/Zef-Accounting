"use client";
import { useCreateCategoryMutation, useGetCategoriesQuery } from "@/redux/slices/api/categoryApiSlice";
import { IAddCategory } from "@/types/category";
import { KeyboardDoubleArrowRight } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  MenuItem,
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
import { IAddSubCategory } from "@/types/subcategory";
import { useCreateSubCategoryMutation } from "@/redux/slices/api/subcategoryApiSlice";


const AddSubCategoryAdminPage = () => {
  const router = useRouter();
    const [category, setCategory] = useState("");
  const [createSubCategory] = useCreateSubCategoryMutation();
    const { data: categoriesResponse } = useGetCategoriesQuery();
    const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<IAddSubCategory>();

  const onSubmit = async (values: IAddSubCategory) => {
    
    try {
            const formData = new FormData();
      formData.append("title", values.title);
        formData.append("category", values.category);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createSubCategory(formData).unwrap();

      toast.success("you have created category successfully");
      reset();
      setTimeout(() => {
        router.push(`/admin-dashboard/subcategories`);
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
      Add subcategory
        <Tooltip
          title={"back to Categories admin dashboard"}
          placement="right-end"
          enterDelay={200}
        >
          <IconButton
            onClick={() => router.push(`/admin-dashboard/subcategories`)}
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

          <TextField
              select
              label="Category"
              fullWidth
              defaultValue=""
              {...register("category", { required: "Category is required" })}
              error={!!errors.category}
              helperText={errors.category && "Category is required"}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
              {(categoriesResponse?.categories?.length ?? 0) > 0 ? (
                categoriesResponse?.categories.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.title}
                  </MenuItem>
                ))
              ) : (
                <MenuItem disabled value="">
                  No categories available
                </MenuItem>
              )}
            </TextField>
      

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

export default AddSubCategoryAdminPage;
