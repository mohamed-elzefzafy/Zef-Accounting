"use client";
import { useAppSelector } from '@/redux/hooks';
import { useVerifyAccountMutation } from '@/redux/slices/api/authApiSlice';
import { Button, Stack, Typography } from '@mui/material';
import { redirect, useRouter } from 'next/navigation';
import React from 'react'
import toast from 'react-hot-toast';

const VerifyAccountPage = () => {
    const { userInfo } = useAppSelector((state) => state.auth);
    if (userInfo.isAccountVerified) redirect("/");
    const router = useRouter();
    const [verifyAccount] = useVerifyAccountMutation();

    const handleVerifyAccount = async() => {
      try {
        await verifyAccount({ email: userInfo.email }).unwrap();
        toast.success("code sent to your email");
          router.push("/auth/enterVerifyCode",);
      } catch (error) {
        toast.error((error as { data: { message: string } })?.data?.message);
      }
    }
  return (
    <Stack
        component="form"
        // onSubmit={handleSubmit(onSubmit)}
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
        <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
      Verify Your Account
        </Typography>

  

        <Button
          // type="submit"
          size='large'
          variant="contained"
          color="primary"
          sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
          onClick={handleVerifyAccount}
          // disabled={}
        >
          Send code to my email
        </Button>

      </Stack>
  )
}

export default VerifyAccountPage;