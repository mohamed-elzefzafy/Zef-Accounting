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
import { Controller, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import ImageIcon from "@mui/icons-material/Image";
import { ICreateTaxAndSipping } from "@/types/taxAndSipping";
import { useGetAdminTaxAndShippingQuery, useUpdateTaxAndShippingMutation } from "@/redux/slices/api/taxAndSippingApiSlice";
import Loading from "@/app/loading";

const TaxAndSippingPage = () => {
    const router = useRouter();
    const {data : taxAndSipping ,isLoading ,refetch} = useGetAdminTaxAndShippingQuery();
    const [updateTaxAndShipping] = useUpdateTaxAndShippingMutation()

  const {
    register,
    handleSubmit,
    control,
    // reset,
    setValue,
    formState: { isSubmitting, errors },
  } = useForm<ICreateTaxAndSipping>({
        defaultValues: {
      taxRate: 0,
      shippingPrice: 0
    },
  });


      useEffect(() => {
      if (taxAndSipping) {
        setValue("taxRate", taxAndSipping.taxRate);
        setValue("shippingPrice", taxAndSipping.shippingPrice);
        refetch();
      }
    }, [refetch, setValue, taxAndSipping] );

  const onSubmit = async (values: ICreateTaxAndSipping) => {
    try {
          await updateTaxAndShipping({taxRate: +values.taxRate, shippingPrice : +values.shippingPrice}).unwrap();
      router.refresh();
      toast.success("you have updated tax and shipping successfully");
      // reset();
      setTimeout(() => {
      }, 1000);
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  }
  if (isLoading){
    return <Loading/>
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
        Update tax shipping
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
  
          <Controller
                  name="taxRate"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="Tax Rate"
                      fullWidth
                    />
                  )}
                />

                        <Controller
                  name="shippingPrice"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      type="number"
                      label="shipping price"
                      fullWidth
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
      Update category
      </Button> */}


      
      
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
                "Update tax and shipping"
              )}
            </Button>
    </Stack>
  );
};

export default TaxAndSippingPage;
