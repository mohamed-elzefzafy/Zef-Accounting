"use client";
import { useCreateCategoryMutation } from "@/redux/slices/api/categoryApiSlice";
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
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageIcon from "@mui/icons-material/Image";
import { ChangeEvent, useState } from "react";
import { ICreateBanner } from "@/types/banner";
import { useCreateBannerMutation } from "@/redux/slices/api/bannerApiSlice";


const AddBannerAdminPage = () => {
  const router = useRouter();
  const [createBanner] = useCreateBannerMutation();
    const [imageFile, setImageFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting, errors },
  } = useForm<ICreateBanner>({
        defaultValues: {
      text: "",
      discount: 0,
    },
  });

  const onSubmit = async (values: ICreateBanner) => {
    
    try {
            const formData = new FormData();
      formData.append("text", values.text);
      formData.append("discount", values.discount.toString());

      if (imageFile) {
        formData.append("image", imageFile);
      }

      await createBanner(formData).unwrap();

      toast.success("you have created banner successfully");
      reset();
      setTimeout(() => {
        router.push(`/admin-dashboard/banners`);
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
      Add banner
        <Tooltip
          title={"back to Banners admin dashboard"}
          placement="right-end"
          enterDelay={200}
        >
          <IconButton
            onClick={() => router.push(`/admin-dashboard/banners`)}
          >
            <KeyboardDoubleArrowRight sx={{ color: "primary.main" }} />
          </IconButton>
        </Tooltip>
      </Typography>
      <TextField
        type="text"
        placeholder="Text"
        label="text"
        sx={{ width: "100%" }}
        {...register("text", { required: "text is required" })}
        error={errors.text ? true : false}
        helperText={errors.text && "text is required"}
      />

      
                    <Controller
                      name="discount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          type="number"
                          label="Discount"
                          fullWidth
                          // error={!!fieldState.error}
                          // helperText={fieldState.error?.message}
                        />
                      )}
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
              {imageFile ? "banner image selected" : "Upload banner image"}
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
                "Add banner "
              )}
            </Button>
    </Stack>
  );
};

export default AddBannerAdminPage;
