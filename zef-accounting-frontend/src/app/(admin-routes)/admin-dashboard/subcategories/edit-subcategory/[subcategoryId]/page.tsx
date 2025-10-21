"use client";
import { useCreateCategoryMutation, useGetCategoriesQuery, useGetOneCategoryQuery, useUpdateCategoryMutation } from "@/redux/slices/api/categoryApiSlice";
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
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, use, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageIcon from "@mui/icons-material/Image";
import { IAddSubCategory } from "@/types/subcategory";
import { useGetOneSubCategoryQuery, useUpdateSubCategoryMutation } from "@/redux/slices/api/subcategoryApiSlice";
import { is } from "zod/v4/locales";
import Loading from "@/app/loading";

const EditSubCategoryAdminPage = () => {
    const router = useRouter();
      const { subcategoryId } = useParams<{ subcategoryId: string }>();
    // const resolvedParams = use(params);
        const [imageFile, setImageFile] = useState<File | null>(null);
          const { data: categoriesResponse } = useGetCategoriesQuery();
        
    const {data : subCategory ,isLoading,refetch} = useGetOneSubCategoryQuery(subcategoryId);
        const [category, setCategory] = useState(subCategory?.category._id);
  const [updateSubCategory] = useUpdateSubCategoryMutation();

  console.log("setCategory",subCategory);
  useEffect(()=>{
    setCategory(subCategory?.category._id);
    refetch();
  },[subCategory?.category._id,refetch])


  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<IAddSubCategory>();


    //   useEffect(() => {
    //   if (subCategory) {
    //     setValue("title", subCategory.title);
    //     setValue("category", subCategory.category._id);
    //     refetch();
    //   }
    // }, [refetch, setValue, subCategory] );

      // useEffect(() => {
      //   if (subCategory) {
      //     reset({
      //       title: subCategory.title,
      //       category: subCategory.category?._id,
      //     });
      //     setCategory(subCategory.category?._id);
      //   }
      // }, [reset, subCategory]);

        useEffect(() => {
          if (subCategory) {
            reset({
              title: subCategory.title,
              category: subCategory.category?._id,
            });
            setCategory(subCategory.category?._id || "");
          }
        }, [subCategory, reset]);
      

  const onSubmit = async (values: IAddSubCategory) => {
    console.log(values);
    
    try {
                const formData = new FormData();
      formData.append("title", values.title);
        formData.append("category", values.category);

      if (imageFile) {
        formData.append("image", imageFile);
      }

          await updateSubCategory({
        payLoad: formData,
        subcategoryId,
      }).unwrap();
      router.refresh();
      toast.success("you have created category successfully");
      // reset();
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
if (isLoading){
return  <Loading/>
}

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
        Update subcategory
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
        defaultValue={subCategory?.title}
        label="title"
        sx={{ width: "100%" }}
        {...register("title", { required: "title is required" })}
        error={errors.title ? true : false}
        helperText={errors.title && "title is required"}
      />

                {/* Category */}
                  {/* <TextField
                    select
                    label="Category"
                    fullWidth
                    {...register("category", { required: "Category is required" })}
                    error={!!errors.category}
                    helperText={errors.category && "Category is required"}
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {(categoriesResponse?.categories || []).map((cat) => (
                      <MenuItem key={cat._id} value={cat._id}>
                        {cat.title}
                      </MenuItem>
                    ))}
                  </TextField> */}

                  <TextField
  select
  label="Category"
  fullWidth
  {...register("category", { required: "Category is required" })}
  error={!!errors.category}
  helperText={errors.category && "Category is required"}
  value={category || ""}   // ✅ دا بيضمن إنه مش undefined أبداً
  onChange={(e) => {
    setCategory(e.target.value);
    setValue("category", e.target.value); // ✅ Sync مع React Hook Form
  }}
>
  {(categoriesResponse?.categories || []).map((cat) => (
    <MenuItem key={cat._id} value={cat._id}>
      {cat.title}
    </MenuItem>
  ))}
</TextField>

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
                subCategory?.image.url ?  <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
                <Image
                  src={subCategory?.image.url }
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

export default EditSubCategoryAdminPage;
