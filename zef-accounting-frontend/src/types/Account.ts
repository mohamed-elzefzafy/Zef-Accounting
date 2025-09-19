export enum AccountType {
  Asset = "Asset",
  Liability = "Liability",
  Equity = "Equity",
  Revenue = "Revenue",
  Expense = "Expense",
}

export interface IAccount {
  id: number;            
  name: string;
  type: AccountType;
  accountCode?: string;
  parent?: string | null; 
  isMain: boolean;
  isSub: boolean;
  createdAt: string;      
  updatedAt: string;
}
