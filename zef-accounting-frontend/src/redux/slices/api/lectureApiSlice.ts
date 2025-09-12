// import { ILectureResponse } from "@/types/lecture";
// import { apiSlice } from "./apiSlice";

// export const lectureApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     createLecture: builder.mutation({
//       query: (data) => ({
//         url: `/api/v1/lecture`,
//         method: "POST",
//         body: data,
//       }),
//     }),

//     getLectures: builder.query<ILectureResponse, string>({
//       query: (courseId) => ({
//         url: `/api/v1/lecture/lectures-course/${courseId}`,
//       }),
//       keepUnusedDataFor: 5,
//       providesTags: ["Lecture"],
//     }),

//     getInstructorCoursesLectures: builder.query<
//       ILectureResponse,
//       number | void
//     >({
//       query: (page) => ({
//         url: `/api/v1/lecture/my-lectures-courses?page=${page}`,
//         headers: {
//           "Cache-Control": "no-store",
//         },
//       }),
//       keepUnusedDataFor: 1,
//       providesTags: (result) =>
//         result
//           ? [
//               ...result.lectures.map(({ _id }) => ({
//                 type: "Lecture" as const,
//                 _id,
//               })),
//               { type: "Lecture", _id: "LIST" },
//             ]
//           : [{ type: "Lecture", _id: "LIST" }],
//     }),

//     deleteLecturesInstructorPage: builder.mutation<
//       void,
//       { _id: string; page?: number }
//     >({
//       query: ({ _id }) => ({
//         url: `/api/v1/lecture/${_id}`,
//         method: "DELETE",
//       }),
//       async onQueryStarted({ _id, page }, { dispatch, queryFulfilled }) {
//         const queryParams = `?page=${page}`;
//         const patchResult = dispatch(
//           lectureApiSlice.util.updateQueryData(
//             "getLectures",
//             queryParams,
//             (draft: ILectureResponse) => {
//               draft.lectures = draft.lectures.filter(
//                 (lecture) => lecture._id !== _id
//               );
//               draft.pagination.total -= 1;
//               if (draft.lectures.length === 0 && page && page > 1) {
//                 draft.pagination.page = page - 1;
//               }
//             }
//           )
//         );
//         try {
//           await queryFulfilled;
//         } catch {
//           patchResult.undo();
//         }
//       },
//       invalidatesTags: (result, error, { _id }) => [{ type: "Lecture", _id }],
//     }),

//     updateLecturePosition: builder.mutation({
//       query: ({ payLoad, lectureId }) => ({
//         url: `/api/v1/lecture/update-position/${lectureId}`,
//         method: "PATCH",
//         body: payLoad,
//       }),
//       invalidatesTags: ["Lecture"],
//     }),

//     updateLecture: builder.mutation({
//       query: ({ payLoad, lectureId }) => ({
//         url: `/api/v1/lecture/${lectureId}`,
//         headers: {
//           "Cache-Control": "no-store", // Prevent caching
//         },
//         method: "PATCH",
//         body: payLoad,
//       }),
//     }),

//     addLectureAttachments: builder.mutation({
//       query: ({ payLoad, lectureId }) => ({
//         url: `/api/v1/lecture/attachments/${lectureId}`,
//         headers: {
//           "Cache-Control": "no-store", // Prevent caching
//         },
//         method: "PATCH",
//         body: payLoad,
//       }),
//     }),

//     removeLectureAttachments: builder.mutation({
//       query: ({ lectureId, publicId }) => ({
//         url: `/api/v1/lecture/attachments/${lectureId}?publicId=${publicId}`,
//         headers: {
//           "Cache-Control": "no-store", // Prevent caching
//         },
//         method: "DELETE",
//       }),
//     }),

//     removeLecture: builder.mutation({
//       query: (lectureId) => ({
//         url: `/api/v1/lecture/${lectureId}`,
//         headers: {
//           "Cache-Control": "no-store", // Prevent caching
//         },
//         method: "DELETE",
//       }),
//     }),
//   }),
// });

// export const {
//   useGetLecturesQuery,
//   useUpdateLecturePositionMutation,
//   useCreateLectureMutation,
//   useAddLectureAttachmentsMutation,
//   useRemoveLectureAttachmentsMutation,
//   useUpdateLectureMutation,
//   useRemoveLectureMutation,
//   useGetInstructorCoursesLecturesQuery,
//   useDeleteLecturesInstructorPageMutation,
// } = lectureApiSlice;
