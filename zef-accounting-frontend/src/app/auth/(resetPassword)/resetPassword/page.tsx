"use client";
import { useResetPasswordMutation } from "@/redux/slices/api/authApiSlice";
import { Box, Button, CircularProgress, Stack, TextField, Typography } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IResetPasswordCode {
  email: string;
}

const ResetPassword = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const userNameQuery = searchParams.get("userName");
  const [resetPassword] = useResetPasswordMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<IResetPasswordCode>();

  const onSubmit = async (values: IResetPasswordCode) => {
    try {
      await resetPassword(values).unwrap();
      toast.success("reset password code sent to your email");
      router.push("/auth/updatePassord");
      reset();
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };

  return (
    <>
      {userNameQuery && (
        <Box
          sx={{
            display: "flex",
            justifyItems: "center",
            alignItems: "center",
            width: "100%",
            mt: 5,
          }}
        >
          <Typography sx={{ mx: "auto", display: "flex", gap: 1 }}>
            Thanks{" "}
            <Typography sx={{ color: lightBlue[700] }}>
              {userNameQuery}
            </Typography>{" "}
            for registering, please verify your email
          </Typography>
        </Box>
      )}
      <Stack
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          maxWidth: { xs: "70%", md: "30%" },
          mx: "auto",
          mt: 5,
          display: "flex",
          alignItems: "center",
          justifyItems: "center",
          justifyContent: "center",
          gap: 2,
        }}
      >
        <Typography variant="h6" component="h2">
        reset-password
        </Typography>

        <TextField
          type="email"
          placeholder="email"
          label="email"
          sx={{ width: "100%" }}
          {...register("email", { required: "Email is required" })}
          error={!!errors.email}
          helperText={errors.email?.message}
        />

      

            <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                          disabled={isSubmitting || !isValid}
                        sx={{ textTransform: "capitalize", position: "relative" }}
                      >
                        {isSubmitting ? (
                          <CircularProgress size={24} sx={{ color: "white" }} />
                        ) : (
                          "reset-password"
                        )}
                      </Button>
      </Stack>
    </>
  );
};

export default ResetPassword;
