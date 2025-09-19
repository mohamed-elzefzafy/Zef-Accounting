"use client";
import { useUpdatePasswordMutation } from "@/redux/slices/api/authApiSlice";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IUpdatePassord {
  email: string;
  verificationCode: string;
  newPassword: string;
}

const UpdatePassord = () => {
  const router = useRouter();
  const [updatePassword] = useUpdatePasswordMutation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid, isSubmitting, errors },
  } = useForm<IUpdatePassord & { confirmPassword: string }>();

  const onSubmit = async (
    values: IUpdatePassord & { confirmPassword: string }
  ) => {
        if (values.newPassword !== values.confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
    
    try {
      const { user } = await updatePassword({
  email: values.email,
  verificationCode: values.verificationCode,
  newPassword: values.newPassword,
}).unwrap();
      toast.success("you reset your password please login");
      router.push(`/auth/login?userNameFromUpdatePassword=${user?.firstName}`);
      reset();
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };

  return (
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
        Update Password
      </Typography>

      <TextField
        type="email"
        placeholder="Email"
        label="Email"
        sx={{ width: "100%" }}
        {...register("email", { required: "Email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      <TextField
        type="text"
        placeholder="Verification Code"
        label="Verification Code"
        sx={{ width: "100%" }}
        {...register("verificationCode", {
          required: "Verification code is required",
        })}
        error={!!errors.verificationCode}
        helperText={errors.verificationCode?.message}
      />

      <TextField
        type={showPassword ? "text" : "password"}
        placeholder="password"
        label="password"
        sx={{ width: "100%" }}
        {...register("newPassword", { required: "password is required" })}
        error={!!errors.newPassword}
        helperText={errors.newPassword?.message}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowPassword((prev) => !prev)}
                  edge="end"
                >
                  {showPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
      />

      {/* Confirm Password field with Eye icon */}
      <TextField
        type={showConfirmPassword ? "text" : "password"}
        placeholder="confirm-password"
        label="confirm-password"
        sx={{ width: "100%" }}
        {...register("confirmPassword", {
          required: "Confirm password is required",
          validate: (value) =>
            value === watch("newPassword") || "Passwords do not match",
        })}
        error={!!errors.confirmPassword}
        helperText={errors.confirmPassword?.message}
        slotProps={{
          input: {
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  edge="end"
                >
                  {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                </IconButton>
              </InputAdornment>
            ),
          },
        }}
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
                              "update-password"
                              )}
                            </Button>
    </Stack>
  );
};

export default UpdatePassord;
