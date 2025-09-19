// "use client";
// import { useRegisterUserMutation } from "@/redux/slices/api/authApiSlice";
// import { UserRegister } from "@/types/auth";
// import { Button, Stack, TextField, Typography } from "@mui/material";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ChangeEvent, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// const RegisterPage = () => {
//   const router = useRouter();
//   const [registerUser] = useRegisterUserMutation();
//   const [profileImage, setProfileImage] = useState<File | null>();

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setProfileImage(e.target.files[0]);
//     }
//   };
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { isValid, isSubmitting, errors },
//   } = useForm<UserRegister>();

//   const onSubmit = async (values: UserRegister) => {
//     const formData = new FormData();
//     formData.append("firstName", values.firstName);
//     formData.append("lastName", values.lastName);
//     formData.append("email", values.email);
//     formData.append("password", values.password);
//     if (profileImage) {
//       formData.append("profileImage", profileImage);
//     }

//     try {
//       const user = await registerUser(formData).unwrap();

//       toast.success("you have successfully registered");
//       reset();
//       setProfileImage(null);
//       setTimeout(() => {
//         router.push(`/auth/login?userName=${user?.firstName}`);
//       }, 2000);
//     } catch (error) {
//       toast.error((error as { data: { message: string } })?.data?.message);
//     }
//   };
//   return (
//     <Stack
//       component="form"
//       onSubmit={handleSubmit(onSubmit)}
//       sx={{
//         maxWidth: { xs: "70%", md: "30%" },
//         mx: "auto",
//         mt: 5,
//         display: "flex",
//         alignItems: "center",
//         justifyItems: "center",
//         justifyContent: "center",
//         gap: 2,
//       }}
//     >
//       <Typography variant="h6" component="h2">
//         register
//       </Typography>
//       <TextField
//         type="text"
//         placeholder="first-name"
//         label="first-name"
//         sx={{ width: "100%" }}
//         {...register("firstName", { required: "first name is required" })}
//         error={errors.firstName ? true : false}
//         helperText={errors.firstName && "first name is required"}
//       />
//       <TextField
//         type="text"
//         placeholder="last-name"
//         label="last-name"
//         sx={{ width: "100%" }}
//         {...register("lastName", { required: "Last name is required" })}
//         error={errors.lastName ? true : false}
//         helperText={errors.lastName && "Last name is required"}
//       />

//       <TextField
//         type="email"
//         placeholder="email"
//         label="email"
//         sx={{ width: "100%" }}
//         {...register("email", { required: "email is required" })}
//         error={errors.email ? true : false}
//         helperText={errors.email && "email is required"}
//       />

//       <TextField
//         type="password"
//         placeholder="password"
//         label="password"
//         sx={{ width: "100%" }}
//         {...register("password", { required: "password is required" })}
//         error={errors.password ? true : false}
//         helperText={errors.password && "password is required"}
//       />

//       {profileImage && (
//         <Image
//           src={URL.createObjectURL(profileImage)}
//           width={200}
//           height={200}
//           style={{ objectFit: "contain", borderRadius: "5px" }}
//           alt="profileImage"
//         />
//       )}
//       <TextField
//         label="profile-image"
//         type="file"
//         onChange={handleImageChange}
//         fullWidth
//         margin="normal"
//       />

//       <Button
//         type="submit"
//         variant="contained"
//         color="primary"
//         sx={{ mt: 2, textTransform: "capitalize", width: "100%" }}
//         disabled={isSubmitting || !isValid}
//       >
//         register
//       </Button>
//       <Typography>
//         if-you-have-account-already-please
//         <Typography component={Link} href="/auth/login">
//           login
//         </Typography>{" "}
//       </Typography>
//     </Stack>
//   );
// };

// export default RegisterPage;



// "use client";
// import { useRegisterUserMutation } from "@/redux/slices/api/authApiSlice";
// import { UserRegister } from "@/types/auth";
// import { Button, CircularProgress, Stack, TextField, Typography, Link as MuiLink, useTheme } from "@mui/material";
// import ImageIcon from "@mui/icons-material/Image";
// import { useTranslations } from "next-intl";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ChangeEvent, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";
// import * as z from "zod";

// const RegisterPage = () => {
//   const router = useRouter();
//   const theme = useTheme();
//   const [registerUser] = useRegisterUserMutation();
//   const [profileImage, setProfileImage] = useState<File | null>();
//     const t = useTranslations("register");

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setProfileImage(e.target.files[0]);
//     }
//   };
//   const {
//     register,
//     handleSubmit,
//     reset,
//     formState: { isValid, isSubmitting, errors },
//   } = useForm<UserRegister>();

//   const onSubmit = async (values: UserRegister) => {
//     const formData = new FormData();
//     formData.append("firstName", values.firstName);
//     formData.append("lastName", values.lastName);
//     formData.append("email", values.email);
//     formData.append("password", values.password);
//     if (profileImage) {
//       formData.append("profileImage", profileImage);
//     }

//     try {
//       const user = await registerUser(formData).unwrap();

//       toast.success("you have successfully registered");
//       reset();
//       setProfileImage(null);
//       setTimeout(() => {
//         router.push(`/auth/login?userName=${user?.firstName}`);
//       }, 2000);
//     } catch (error) {
//       toast.error((error as { data: { message: string } })?.data?.message);
//     }
//   };
//   return (
//     <Stack
//       component="form"
//       onSubmit={handleSubmit(onSubmit)}
//       sx={{
//         maxWidth: { xs: "70%", md: "30%" },
//         mx: "auto",
//         mt: 5,
//         display: "flex",
//         alignItems: "center",
//         justifyItems: "center",
//         justifyContent: "center",
//         gap: 2,
//       }}
//     >
//       <Typography variant="h6" component="h2" sx={{mt:2}}>
//         {t("register")}
//       </Typography>
//       <TextField
//         type="text"
//         placeholder={t("first-name")}
//         label={t("first-name")}
//         sx={{ width: "100%" }}
//         {...register("firstName", { required: "first name is required" })}
//         error={errors.firstName ? true : false}
//         helperText={errors.firstName && "first name is required"}
//       />
//       <TextField
//         type="text"
//         placeholder={t("last-name")}
//         label={t("last-name")}
//         sx={{ width: "100%" }}
//         {...register("lastName", { required: "Last name is required" })}
//         error={errors.lastName ? true : false}
//         helperText={errors.lastName && "Last name is required"}
//       />

//       <TextField
//         type="email"
//         placeholder={t("email")}
//         label={t("email")}
//         sx={{ width: "100%" }}
//         {...register("email", { required: "email is required" })}
//         error={errors.email ? true : false}
//         helperText={errors.email && "email is required"}
//       />

//       <TextField
//         type="password"
//         placeholder={t("password")}
//         label={t("password")}
//         sx={{ width: "100%" }}
//         {...register("password", { required: "password is required" })}
//         error={errors.password ? true : false}
//         helperText={errors.password && "password is required"}
//       />

//       {profileImage && (
//         <Image
//           src={URL.createObjectURL(profileImage)}
//           width={200}
//           height={200}
//           style={{ objectFit: "contain", borderRadius: "5px" }}
//           alt="profileImage"
//         />
//       )}
//       {/* <TextField
//         label={t("profile-image")}
//         type="file"
//         onChange={handleImageChange}
//         fullWidth
//         margin="normal"
//       /> */}

//                 <Button
//               component="label"
//               variant="outlined"
//               fullWidth
//               sx={{ textTransform: "capitalize" }}
//               startIcon={<ImageIcon />}
//             >
//               {profileImage ? "Profile Image selected" : "Upload Profile Image"}
//               <input
//                 type="file"
//                 hidden
//                 accept="image/*"
//                 onChange={handleImageChange}
//               />
//             </Button>

//                   <Button
//               type="submit"
//               variant="contained"
//               fullWidth
//               disabled={isSubmitting}
//               sx={{ textTransform: "capitalize", position: "relative" }}
//             >
//               {isSubmitting ? (
//                 <CircularProgress
//                   size={24}
//                   sx={{
//                     color: "white",
//                   }}
//                 />
//               ) : (
//                 t("register")
//               )}
//             </Button>

//   <Typography variant="body2" sx={{fontSize:{ xs: "12px", sm: "16px" }}}>
//   {t("if-you-have-account-already-please")}{" "}
// <MuiLink
//   component={Link}
//   href="/auth/login"
//   sx={{ color: `${theme.palette.primary.main} !important`, fontWeight: "bold" }}
//   underline="hover"
// >
//   {t("login")}
// </MuiLink>
// </Typography>
//     </Stack>
//   );
// };

// export default RegisterPage;

// "use client";
// import { useRegisterUserMutation } from "@/redux/slices/api/authApiSlice";
// import { UserRegister } from "@/types/auth";
// import {
//   Button,
//   CircularProgress,
//   Stack,
//   TextField,
//   Typography,
//   Link as MuiLink,
//   useTheme,
// } from "@mui/material";
// import ImageIcon from "@mui/icons-material/Image";
// import { useTranslations } from "next-intl";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { ChangeEvent, useState } from "react";
// import { useForm } from "react-hook-form";
// import toast from "react-hot-toast";

// const RegisterPage = () => {
//   const router = useRouter();
//   const theme = useTheme();
//   const [registerUser] = useRegisterUserMutation();
//   const [profileImage, setProfileImage] = useState<File | null>(null);
//   const t = useTranslations("register");

//   const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
//     if (e.target.files && e.target.files.length > 0) {
//       setProfileImage(e.target.files[0]);
//     }
//   };

//   const {
//     register,
//     handleSubmit,
//     reset,
//     watch,
//     formState: { isSubmitting, errors },
//   } = useForm<UserRegister & { confirmPassword: string }>();

//   const onSubmit = async (values: UserRegister & { confirmPassword: string }) => {
//     if (values.password !== values.confirmPassword) {
//       toast.error("Passwords do not match");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("firstName", values.firstName);
//     formData.append("lastName", values.lastName);
//     formData.append("email", values.email);
//     formData.append("password", values.password);
//     if (profileImage) {
//       formData.append("profileImage", profileImage);
//     }

//     try {
//       const user = await registerUser(formData).unwrap();
//       toast.success("you have successfully registered");
//       reset();
//       setProfileImage(null);
//       setTimeout(() => {
//         router.push(`/auth/login?userName=${user?.firstName}`);
//       }, 2000);
//     } catch (error) {
//       toast.error((error as { data: { message: string } })?.data?.message);
//     }
//   };

//   return (
//     <Stack
//       component="form"
//       onSubmit={handleSubmit(onSubmit)}
//       sx={{
//         maxWidth: { xs: "70%", md: "30%" },
//         mx: "auto",
//         mt: 5,
//         display: "flex",
//         alignItems: "center",
//         justifyItems: "center",
//         justifyContent: "center",
//         gap: 2,
//       }}
//     >
//       <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
//         {t("register")}
//       </Typography>

//       <TextField
//         type="text"
//         placeholder={t("first-name")}
//         label={t("first-name")}
//         sx={{ width: "100%" }}
//         {...register("firstName", { required: "first name is required" })}
//         error={!!errors.firstName}
//         helperText={errors.firstName?.message}
//       />

//       <TextField
//         type="text"
//         placeholder={t("last-name")}
//         label={t("last-name")}
//         sx={{ width: "100%" }}
//         {...register("lastName", { required: "Last name is required" })}
//         error={!!errors.lastName}
//         helperText={errors.lastName?.message}
//       />

//       <TextField
//         type="email"
//         placeholder={t("email")}
//         label={t("email")}
//         sx={{ width: "100%" }}
//         {...register("email", { required: "email is required" })}
//         error={!!errors.email}
//         helperText={errors.email?.message}
//       />

//       <TextField
//         type="password"
//         placeholder={t("password")}
//         label={t("password")}
//         sx={{ width: "100%" }}
//         {...register("password", { required: "password is required" })}
//         error={!!errors.password}
//         helperText={errors.password?.message}
//       />

//       <TextField
//         type="password"
//         placeholder={t("confirm-password")}
//         label={t("confirm-password")}
//         sx={{ width: "100%" }}
//         {...register("confirmPassword", {
//           required: "Confirm password is required",
//           validate: (value) =>
//             value === watch("password") || "Passwords do not match",
//         })}
//         error={!!errors.confirmPassword}
//         helperText={errors.confirmPassword?.message}
//       />

//       {profileImage && (
//         <Image
//           src={URL.createObjectURL(profileImage)}
//           width={200}
//           height={200}
//           style={{ objectFit: "contain", borderRadius: "5px" }}
//           alt="profileImage"
//         />
//       )}

//       <Button
//         component="label"
//         variant="outlined"
//         fullWidth
//         sx={{ textTransform: "capitalize" }}
//         startIcon={<ImageIcon />}
//       >
//         {profileImage ? "Profile Image selected" : "Upload Profile Image"}
//         <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//       </Button>

//       <Button
//         type="submit"
//         variant="contained"
//         fullWidth
//         disabled={isSubmitting}
//         sx={{ textTransform: "capitalize", position: "relative" }}
//       >
//         {isSubmitting ? (
//           <CircularProgress size={24} sx={{ color: "white" }} />
//         ) : (
//           t("register")
//         )}
//       </Button>

//       <Typography
//         variant="body2"
//         sx={{ fontSize: { xs: "12px", sm: "16px" } }}
//       >
//         {t("if-you-have-account-already-please")}{" "}
//         <MuiLink
//           component={Link}
//           href="/auth/login"
//           sx={{
//             color: `${theme.palette.primary.main} !important`,
//             fontWeight: "bold",
//           }}
//           underline="hover"
//         >
//           {t("login")}
//         </MuiLink>
//       </Typography>
//     </Stack>
//   );
// };

// export default RegisterPage;

"use client";
import { useRegisterUserMutation } from "@/redux/slices/api/authApiSlice";
import { UserRegister } from "@/types/auth";
import {
  Button,
  CircularProgress,
  Stack,
  TextField,
  Typography,
  Link as MuiLink,
  useTheme,
  IconButton,
  InputAdornment,
} from "@mui/material";
import ImageIcon from "@mui/icons-material/Image";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChangeEvent, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

const RegisterPage = () => {
  const router = useRouter();
  const theme = useTheme();
  const [registerUser] = useRegisterUserMutation();
  const [profileImage, setProfileImage] = useState<File | null>(null);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setProfileImage(e.target.files[0]);
    }
  };

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting, errors },
  } = useForm<UserRegister & { confirmPassword: string }>();

  const onSubmit = async (
    values: UserRegister & { confirmPassword: string }
  ) => {
    if (values.password !== values.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const formData = new FormData();
    formData.append("firstName", values.firstName);
    formData.append("lastName", values.lastName);
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    try {
      const user = await registerUser(formData).unwrap();
      toast.success("you have successfully registered");
      reset();
      setProfileImage(null);
      setTimeout(() => {
        router.push(`/auth/login?userName=${user?.firstName}`);
      }, 2000);
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
        justifyContent: "center",
        gap: 2,
      }}
    >
      <Typography variant="h6" component="h2" sx={{ mt: 2 }}>
        Register
      </Typography>

      <TextField
        type="text"
        placeholder="first-name"
        label="first-name"
        sx={{ width: "100%" }}
        {...register("firstName", { required: "first name is required" })}
        error={!!errors.firstName}
        helperText={errors.firstName?.message}
      />

      <TextField
        type="text"
        placeholder="last-name"
        label="last-name"
        sx={{ width: "100%" }}
        {...register("lastName", { required: "Last name is required" })}
        error={!!errors.lastName}
        helperText={errors.lastName?.message}
      />

      <TextField
        type="email"
        placeholder="email"
        label="email"
        sx={{ width: "100%" }}
        {...register("email", { required: "email is required" })}
        error={!!errors.email}
        helperText={errors.email?.message}
      />

      {/* Password field with Eye icon */}
      <TextField
        type={showPassword ? "text" : "password"}
        placeholder="password"
        label="password"
        sx={{ width: "100%" }}
        {...register("password", { required: "password is required" })}
        error={!!errors.password}
        helperText={errors.password?.message}
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
            value === watch("password") || "Passwords do not match",
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

      {profileImage && (
        <Image
          src={URL.createObjectURL(profileImage)}
          width={200}
          height={200}
          style={{ objectFit: "contain", borderRadius: "5px" }}
          alt="profileImage"
        />
      )}

      <Button
        component="label"
        variant="outlined"
        fullWidth
        sx={{ textTransform: "capitalize" }}
        startIcon={<ImageIcon />}
      >
        {profileImage ? "Profile Image selected" : "Upload Profile Image"}
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handleImageChange}
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
          <CircularProgress size={24} sx={{ color: "white" }} />
        ) : (
          "register"
        )}
      </Button>

      <Typography variant="body2" sx={{ fontSize: { xs: "12px", sm: "16px" } }}>
      already have account please{" "}
        <MuiLink
          component={Link}
          href="/auth/login"
          sx={{
            color: `${theme.palette.primary.main} !important`,
            fontWeight: "bold",
          }}
          underline="hover"
        >
          login
        </MuiLink>
      </Typography>
    </Stack>
  );
};

export default RegisterPage;
