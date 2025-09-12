import { IUserInfo } from "@/types/auth";
import { apiSlice } from "./apiSlice";


export const authApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/login`,
        method: "POST",
        body: data,
      }),
    }),

    registerUser: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/register`,
        method: "POST",
        body: data,
      }),
    }),

    getOneUser: builder.query<IUserInfo, string | void>({
      query: (id) => ({
        url: `/api/v1/users/${id}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["User"],
    }),

      updateUser: builder.mutation({
      query: ( payLoad ) => ({
        url: `/api/v1/auth`,
        method: "PATCH",
        body: payLoad,
      }),
    }),

    logout: builder.mutation({
      query: () => ({
        url: `/api/v1/auth/logout`,
        method: "POST",
      }),
    }),
    verifyAccount: builder.mutation({
      query: () => ({
        url: `/api/v1/auth/send-verification-code`,
        method: "POST",
      }),
    }),

    enterVerifyCode: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/verify-account`,
        method: "POST",
        body: data,
      }),
    }),

    resetPassword: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/reset-password`,
        method: "POST",
        body: data,
      }),
    }),
    updatePassword: builder.mutation({
      query: (data) => ({
        url: `/api/v1/auth/validateVerificationCode`,
        method: "POST",
        body: data,
      }),
    }),
  }),
});

export const {
  useRegisterUserMutation,
  useLoginMutation,
  useLogoutMutation,
  useVerifyAccountMutation,
  useEnterVerifyCodeMutation,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useGetOneUserQuery,
  useUpdateUserMutation,
} = authApiSlice;
