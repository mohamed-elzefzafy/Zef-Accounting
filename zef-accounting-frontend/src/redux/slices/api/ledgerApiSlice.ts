// import { apiSlice } from "./apiSlice";

// export const ledgerApiSlice = apiSlice.injectEndpoints({
//   endpoints: (builder) => ({
//     getLedger: builder.mutation({
//       query: ( payLoad ) => ({
//         url: `/api/v1/general-ledger`,
//         headers: {
//           "Cache-Control": "no-store", // Prevent caching
//         },
//         method: "POST",
//         body: payLoad,
//       }),
//     }),
//   }),
// });

// export const { useGetLedgerMutation } = ledgerApiSlice;



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
      }),
    }),
  }),
});

export const { useGetLedgerMutation } = ledgerApiSlice;