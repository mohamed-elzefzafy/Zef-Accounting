// account
export interface Account {
  id: number;
  name: string;
  type: string;
  accountCode: string;
  isMain: boolean;
  isSub: boolean;
  createdAt: string;
  updatedAt: string;
}

// ledger item
export interface LedgerItem {
  entryNo: string;
  date: string;
  costCenter: string;
  description: string;
  code: string;
  debit: number;
  credit: number;
  balance: number;
  fiscalYear: number;
  isOpeningBalance?: boolean;
  isClosingBalance?: boolean;
}

// totals
export interface LedgerTotals {
  debit: number;
  credit: number;
  openingBalance: number;
  closingBalance: number;
}

// fiscal year
export interface FiscalYear {
  id: number;
  year: number;
  isClosed: boolean;
  closedAt: string;
}

// full response
export interface GetLedgerResponse {
  account: Account;
  ledger: LedgerItem[];
  totals: LedgerTotals;
  fiscalYears: FiscalYear[];
}


export interface GetLedgerPayload {
  accountId: number;
  startDate?: string;
  endDate?: string;
  costCenter?: number;
}

