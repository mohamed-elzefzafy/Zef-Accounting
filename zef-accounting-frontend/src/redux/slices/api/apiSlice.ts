import { baseURL } from "@/utils/baseUrl";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const baseQuery = fetchBaseQuery({
  baseUrl: baseURL,
  credentials: "include",
});

export const apiSlice = createApi({
  baseQuery,
  tagTypes: ["Accounts", "User","CostCenter","JournalEntry"],
  endpoints: (builder) => ({}),
});
