// import { apiSlice } from "./apiSlice";
// import { IReview, IReviewResponse } from "@/types/review";

// export interface IReviewInput {
//   comment: string;
//   rating: number;
//   course: string;
// }

// export interface IReviewInputUpdate {
//   comment: string;
//   rating: number;
// }

// export const reviewsApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getCourseReviews: builder.query<IReview[], string>({
//       query: (courseId) => ({
//         url: `/api/v1/reviews/find-all/${courseId}`,
//       }),
//       keepUnusedDataFor: 5,
//       providesTags: ["Review"],
//     }),

//         getAdminReviews: builder.query<IReviewResponse, string>({
//       query: () => ({
//         url: `/api/v1/reviews/admin-find-all-reviews`,
//       }),
//       keepUnusedDataFor: 5,
//       providesTags: ["Review"],
//     }),


//     getAllReviewsAdmin: builder.query<IReview[], void>({
//       query: () => ({
//         url: `/api/v1/reviews`,
//       }),
//       keepUnusedDataFor: 5,
//       providesTags: ["Review"],
//     }),

//     createReview: builder.mutation<IReview, IReviewInput>({
//       query: (data) => ({
//         url: `/api/v1/reviews`,
//         method: "POST",
//         body: data,
//       }),
//     }),

//     updateReview: builder.mutation({
//       query: ({ payLoad, reviewId }) => ({
//         url: `/api/v1/reviews/${reviewId}`,
//         method: "PATCH",
//         body: payLoad,
//       }),
//       invalidatesTags: ["Review"],
//     }),

//     deleteReview: builder.mutation({
//       query: (reviewId) => ({
//         url: `/api/v1/reviews/${reviewId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Review"],
//     }),

//     deleteReviewByAdmin: builder.mutation({
//       query: (reviewId) => ({
//         url: `/api/v1/reviews/admin-instructor-remove/${reviewId}`,
//         method: "DELETE",
//       }),
//       invalidatesTags: ["Review"],
//     }),
//   }),
// });

// export const {
//   useGetCourseReviewsQuery,
//   useGetAllReviewsAdminQuery,
//   useCreateReviewMutation,
//   useUpdateReviewMutation,
//   useDeleteReviewMutation,
//   useDeleteReviewByAdminMutation,
//   useGetAdminReviewsQuery,
// } = reviewsApiSlice;
