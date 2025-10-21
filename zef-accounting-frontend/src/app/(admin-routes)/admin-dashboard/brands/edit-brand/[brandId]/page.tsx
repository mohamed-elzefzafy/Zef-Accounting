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
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageIcon from "@mui/icons-material/Image";
import { useGetOneBrandQuery, useUpdateBrandMutation } from "@/redux/slices/api/brandApiSlice";
import { IAddBrand } from "@/types/brand";

const EditCategoryAdminPage = () => {
    const router = useRouter();
    const { brandId } = useParams<{ brandId: string }>();
        const [imageFile, setImageFile] = useState<File | null>(null);
    const {data : brand ,refetch} = useGetOneBrandQuery(brandId);
    
  const [updateBrand] = useUpdateBrandMutation();

  const {
    register,
    handleSubmit,
    // reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<IAddBrand>();


      useEffect(() => {
      if (brand) {
        setValue("title", brand.title);
        refetch();
      }
    }, [brand, refetch, setValue] );

  const onSubmit = async (values: IAddBrand) => {
    
    try {
                const formData = new FormData();
      formData.append("title", values.title);

      if (imageFile) {
        formData.append("image", imageFile);
      }

          await updateBrand({
        payLoad: formData,
        brandId,
      }).unwrap();
      router.refresh();
      toast.success("you have created brand successfully");
      // reset();
      setTimeout(() => {
        router.push(`/admin-dashboard/brands`);
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
        Update brand
        <Tooltip
          title={"back to Categories admin dashboard"}
          placement="right-end"
          enterDelay={200}
        >
          <IconButton
            onClick={() => router.push(`/admin-dashboard/brands`)}
          >
            <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Typography>
      <TextField
        type="text"
        placeholder="title"
        defaultValue={brand?.title}
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
                brand?.image.url ?  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Image
                  src={brand?.image.url }
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
              {imageFile ? "brand image selected" : "Upload brand image"}
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
                "Update Brand"
              )}
            </Button>
    </Stack>
  );
};

export default EditCategoryAdminPage;
