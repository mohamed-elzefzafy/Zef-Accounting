"use client";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useEnterVerifyCodeMutation } from "@/redux/slices/api/authApiSlice";
import { setCredentials } from "@/redux/slices/authSlice";
import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { lightBlue } from "@mui/material/colors";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

interface IEnterVerifyCode {
  email: string;
  verificationCode: string;
}

const EnterVerifyCode = () => {
  const { userInfo } = useAppSelector((state) => state.auth);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const userNameQuery = searchParams.get("userName");
  const [enterVerifyCode] = useEnterVerifyCodeMutation();
  const [isVerified, setIsVerified] = useState(false); 

  const {
    register,
    handleSubmit,
    reset,
    formState: { isValid, isSubmitting, errors },
  } = useForm<IEnterVerifyCode>();

  const onSubmit = async (values: IEnterVerifyCode) => {
    try {
      const { user } = await enterVerifyCode(values).unwrap();
      toast.success("Your account has been verified successfully");
      dispatch(setCredentials({ ...user }));
      console.log(user);
      
      setIsVerified(true);
      reset();
    } catch (error) {
      toast.error((error as { data: { message: string } })?.data?.message);
    }
  };

  useEffect(() => {
    if (userInfo?.isAccountVerified || isVerified) {
      router.replace("/");
    }
  }, [userInfo, isVerified, router]);

  if (userInfo?.isAccountVerified || isVerified) return null;

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
        verify-email
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

        <TextField
          type="text"
          placeholder="verification-code"
          label="verification-code"
          sx={{ width: "100%" }}
          {...register("verificationCode", {
            required: "Verification code is required",
          })}
          error={!!errors.verificationCode}
          helperText={errors.verificationCode?.message}
        />

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
          disabled={isSubmitting || !isValid}
        >
          Verify-code
        </Button>
      </Stack>
    </>
  );
};

export default EnterVerifyCode;
