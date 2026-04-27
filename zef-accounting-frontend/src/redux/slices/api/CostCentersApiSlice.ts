import { apiSlice } from "./apiSlice";
import { ICostCenter } from "@/types/costCenters";

export const CostCentersApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCostCenters: builder.query<ICostCenter[], void>({
      query: () => ({
        url: `/api/v1/cost-centers`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["CostCenter"],
    }),
  }),
});

export const { useGetCostCentersQuery } = CostCentersApiSlice;
