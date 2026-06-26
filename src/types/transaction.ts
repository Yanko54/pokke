 export type TransactionType =
  | 'income'
  | 'expense';
 
 export type Transaction = {
    id: string;
    templateId: string | null
    type: TransactionType;
    icon: string;
    amount: number;
    memo: string | null;
    createdAt: string;
  };
