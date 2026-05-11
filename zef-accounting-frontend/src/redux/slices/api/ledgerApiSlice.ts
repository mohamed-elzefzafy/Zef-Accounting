import { GetLedgerPayload, GetLedgerResponse } from "@/types/get-ledger";
import { apiSlice } from "./apiSlice";

export const ledgerApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getLedger: builder.mutation<GetLedgerResponse, GetLedgerPayload>({
      query: (payLoad) => ({
        url: `/api/v1/general-ledger`,
        headers: {
          "Cache-Control": "no-store",
        },
        method: "POST",
        body: payLoad,
        providesTags: ["GeneralLedger"],
      }),
    }),
  }),
});

export const { useGetLedgerMutation } = ledgerApiSlice;
