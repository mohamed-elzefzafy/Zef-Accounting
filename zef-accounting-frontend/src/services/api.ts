// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:9000/api/v1';

// export const api = createApi({
//   reducerPath: 'api',
//   baseQuery: fetchBaseQuery({ baseUrl: API_BASE, credentials: 'include' }),
//   tagTypes: ['Journal', 'Ledger', 'Accounts', 'CostCenters'],
//   endpoints: (builder) => ({
//     login: builder.mutation({ query: (body) => ({ url: '/auth/login', method: 'POST', body }) }),
//     getAccounts: builder.query({ query: () => '/chart-of-accounts', providesTags: ['Accounts'] }),
//     getCostCenters: builder.query({ query: () => '/cost-centers', providesTags: ['CostCenters'] }),
//     createJournal: builder.mutation({ query: (body) => ({ url: '/journal-entries', method: 'POST', body }), invalidatesTags: ['Journal','Ledger'] }),
//     updateJournal: builder.mutation({ query: ({id, body}) => ({ url: `/journal-entries/${id}`, method: 'PATCH', body }) }),
//     getLedger: builder.mutation({ query: (body) => ({ url: '/general-ledger', method: 'POST', body }), providesTags: ['Ledger'] }),
//   }),
// });

// export const { useLoginMutation, useGetAccountsQuery, useGetCostCentersQuery, useCreateJournalMutation, useUpdateJournalMutation, useGetLedgerMutation } = api;
