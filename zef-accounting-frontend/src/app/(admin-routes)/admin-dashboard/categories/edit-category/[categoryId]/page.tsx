"use client";
import { useCreateCategoryMutation, useGetOneCategoryQuery, useUpdateCategoryMutation } from "@/redux/slices/api/categoryApiSlice";
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
import { ChangeEvent, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageIcon from "@mui/icons-material/Image";

const EditCategoryAdminPage = ({ params }: { params: Promise<{ categoryId: string }> }) => {
    const router = useRouter();
    const resolvedParams = use(params);
        const [imageFile, setImageFile] = useState<File | null>(null);
    const {data : category ,refetch} = useGetOneCategoryQuery(resolvedParams.categoryId);
    
  const [updateCategory] = useUpdateCategoryMutation();

  const {
    register,
    handleSubmit,
    // reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<IAddCategory>();


      useEffect(() => {
      if (category) {
        setValue("title", category.title);
        refetch();
      }
    }, [category, refetch, setValue] );

  const onSubmit = async (values: IAddCategory) => {
    console.log(values);
    
    try {
                const formData = new FormData();
      formData.append("title", values.title);

      if (imageFile) {
        formData.append("image", imageFile);
      }

          await updateCategory({
        payLoad: formData,
        categoryId: resolvedParams.categoryId,
      }).unwrap();
      router.refresh();
      toast.success("you have created category successfully");
      // reset();
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
        Update category
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
        defaultValue={category?.title}
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
      Update category
      </Button> */}

        {imageFile ? (
              <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Image
                  src={URL.createObjectURL(imageFile)}
                  width={200}
                  height={200}
                  style={{ objectFit: "contain", borderRadius: "5px" }}
                  alt="categoryImage"
                />
              </Box>
            ) :
                category?.image.url ?  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Image
                  src={category?.image.url }
                  width={200}
                  height={200}
                  style={{ objectFit: "contain", borderRadius: "5px" }}
                  alt="profileImage"
                />
              </Box> : null
            
            }
      
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
                "Update Category"
              )}
            </Button>
    </Stack>
  );
};

export default EditCategoryAdminPage;
