import { IUserResponse } from "@/types/user";
import { apiSlice } from "./apiSlice";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query<IUserResponse, string | void>({
      query: (queries = "") => ({
        url: `/api/v1/users${queries}&_t=${Date.now()}`,
        headers: {
          "Cache-Control": "no-store",
        },
      }),
      keepUnusedDataFor: 1,
      providesTags: (result) =>
        result
          ? [
              ...result.users.map(({ _id }) => ({ type: "User" as const, _id })),
              { type: "User", id: "LIST" },
            ]
          : [{ type: "User", id: "LIST" }],
    }),

    deleteUserAdminPage: builder.mutation<void, { _id: string; page?: number }>({
      query: ({ _id }) => ({
        url: `/api/v1/users/${_id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ _id, page }, { dispatch, queryFulfilled }) {
        const queryParams = `?page=${page}`;
        const patchResult = dispatch(
          userApiSlice.util.updateQueryData(
            "getUsers",
            queryParams,
            (draft: IUserResponse) => {
              draft.users = draft.users.filter((user) => user._id !== _id);
              draft.pagination.total -= 1;
              if (draft.users.length === 0 && page && page > 1) {
                draft.pagination.page = page - 1;
              }
            }
          )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
      invalidatesTags: (result, error, { _id }) => [{ type: "User", _id }],
    }),

        deleteCurrentUser: builder.mutation({
      query: () => ({
        url: `/api/v1/auth/delete-current-user`,
        headers: {
          "Cache-Control": "no-store", // Prevent caching
        },
        method: "DELETE",
      }),
      invalidatesTags: ["User"],
    }),

  }),
});

export const { useGetUsersQuery, useDeleteUserAdminPageMutation , useDeleteCurrentUserMutation} =
  userApiSlice;
