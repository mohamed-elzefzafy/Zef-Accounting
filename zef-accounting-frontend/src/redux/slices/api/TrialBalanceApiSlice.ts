import { apiSlice } from "./apiSlice";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface TrialBalanceRow {
  accountId:     number;
  accountCode:   string;
  accountName:   string;
  level:         number;
  isMain:        boolean;
  openingDebit:  number;
  openingCredit: number;
  periodDebit:   number;
  periodCredit:  number;
  closingDebit:  number;
  closingCredit: number;
}

export interface TrialBalanceTotals {
  openingDebit:  number;
  openingCredit: number;
  periodDebit:   number;
  periodCredit:  number;
  closingDebit:  number;
  closingCredit: number;
}

export interface CompanyTrialBalanceResult {
  startDate:   string;
  endDate:     string;
  level:       number | null;
  isEstimated: boolean;
  rows:        TrialBalanceRow[];
  totals:      TrialBalanceTotals;
}

export interface AccountTrialBalanceResult {
  account: {
    id:     number;
    code:   string;
    name:   string;
    isMain: boolean;
  };
  startDate:   string;
  endDate:     string;
  isEstimated: boolean;
  rows:        TrialBalanceRow[];
  totals:      TrialBalanceTotals;
}

export interface GetCompanyTrialBalanceDto {
  startDate: string;
  endDate:   string;
  level?:    number;
}

export interface GetAccountTrialBalanceDto {
  accountId:   number;
  startDate:   string;
  endDate:     string;
  costCenter?: number;
}

// ─────────────────────────────────────────────────────────────────────────────
// ✅ injectEndpoints على الـ apiSlice الموجود
// مش createApi جديد — عشان كده مش محتاج تضيف middleware أو reducer للـ store
// ─────────────────────────────────────────────────────────────────────────────
export const trialBalanceApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    // GET /trial-balance?startDate=&endDate=&level=
    getCompanyTrialBalance: builder.mutation<
      CompanyTrialBalanceResult,
      GetCompanyTrialBalanceDto
    >({
      query: (dto) => {
        const params = new URLSearchParams();
        params.set("startDate", dto.startDate);
        params.set("endDate",   dto.endDate);
        if (dto.level !== undefined) params.set("level", String(dto.level));
        return {
          url:    `/api/v1/trial-balance?${params.toString()}`,
          method: "GET",
        };
      },
      invalidatesTags: ["TrialBalance"],
    }),

    // GET /trial-balance/account?accountId=&startDate=&endDate=&costCenter=
    getAccountTrialBalance: builder.mutation<
      AccountTrialBalanceResult,
      GetAccountTrialBalanceDto
    >({
      query: (dto) => {
        const params = new URLSearchParams();
        params.set("accountId", String(dto.accountId));
        params.set("startDate", dto.startDate);
        params.set("endDate",   dto.endDate);
        if (dto.costCenter !== undefined)
          params.set("costCenter", String(dto.costCenter));
        return {
          url:    `api/v1/trial-balance/account?${params.toString()}`,
          method: "GET",
        };
      },
      invalidatesTags: ["TrialBalance"],
    }),
  }),
});

export const {
  useGetCompanyTrialBalanceMutation,
  useGetAccountTrialBalanceMutation,
} = trialBalanceApiSlice;