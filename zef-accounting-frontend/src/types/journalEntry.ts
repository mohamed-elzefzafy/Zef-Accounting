// Line item inside a journal entry
export interface IJournalEntryLine {
  account: string;      // account _id (string)
  debit: number;
  credit: number;
  costCenter?: string | null; // costCenter _id (string) or null
}

// Full journal entry object returned from backend
export interface IJournalEntry {
  _id: string;
  date: string; // ISO string (backend sends Date as string in JSON)
  description: string;
  entries: IJournalEntryLine[];
  createdBy: string;
  lastModifiedBy?: string;
  createdAt: string;
  updatedAt: string;
}

// Input when creating a new journal entry
export interface ICreateJournalEntryInput {
  date: string; // ISO string
  description: string;
  entries: IJournalEntryLine[];
}
