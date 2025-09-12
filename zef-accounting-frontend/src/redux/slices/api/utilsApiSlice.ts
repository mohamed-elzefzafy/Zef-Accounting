// import {  IGetAdminCounts, IGetInstructorCounts } from "@/types/general";
// import { apiSlice } from "./apiSlice";

// export const utilsApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getInstructorCounts: builder.query<IGetInstructorCounts, string>({
//       query: (instructorId) => ({
//         url: `/api/v1/app/get-instructor-counts/${instructorId}`,
//       }),
//       keepUnusedDataFor: 5,
//     }),
//     getAdminCounts: builder.query<IGetAdminCounts, void>({
//       query: () => ({
//         url: `/api/v1/app/get-admin-counts`,
//       }),
//       keepUnusedDataFor: 5,
//     }),

//   //   createCategory: builder.mutation({
//   //     query: (data) => ({
//   //       url: `/api/v1/category`,
//   //       method: "POST",
//   //       body: data,
//   //     }),
//   //   }),

//   //   getCategoriesAdmin: builder.query<ICategoryResponse, string | void>({
//   //     query: (queries = "") => ({
//   //       url: `/api/v1/category${queries}&_t=${Date.now()}`,
//   //       headers: {
//   //         "Cache-Control": "no-store",
//   //       },
//   //     }),
//   //     keepUnusedDataFor: 1,
//   //     providesTags: (result) =>
//   //       result
//   //         ? [
//   //             ...result.categories.map(({ id }) => ({
//   //               type: "Category" as const,
//   //               id,
//   //             })),
//   //             { type: "Category", id: "LIST" },
//   //           ]
//   //         : [{ type: "Category", id: "LIST" }],
//   //   }),

//   //   deleteCategoryAdminPage: builder.mutation<
//   //     void,
//   //     { id: number; page?: number }
//   //   >({
//   //     query: ({ id }) => ({
//   //       url: `/api/v1/category/${id}`,
//   //       method: "DELETE",
//   //     }),
//   //     async onQueryStarted({ id, page }, { dispatch, queryFulfilled }) {
//   //       const queryParams = `?page=${page}`;
//   //       const patchResult = dispatch(
//   //         categoryApiSlice.util.updateQueryData(
//   //           "getCategoriesAdmin",
//   //           queryParams,
//   //           (draft: ICategoryResponse) => {
//   //             draft.categories = draft.categories.filter(
//   //               (category) => category.id !== id
//   //             );
//   //             draft.pagination.total -= 1;
//   //             if (draft.categories.length === 0 && page && page > 1) {
//   //               draft.pagination.page = page - 1;
//   //             }
//   //           }
//   //         )
//   //       );
//   //       try {
//   //         await queryFulfilled;
//   //       } catch {
//   //         patchResult.undo();
//   //       }
//   //     },
//   //     invalidatesTags: (result, error, { id }) => [{ type: "Category", id }],
//   //   }),
//   }),
// });

// export const {useGetInstructorCountsQuery,useGetAdminCountsQuery} = utilsApiSlice;
