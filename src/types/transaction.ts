 export type TransactionType =
  | 'income'
  | 'expense';
 
 export type Transaction = {
    id: string;
    templateId: string | null
    transactionType: TransactionType;
    icon: string;
    amount: number;
    memo: string | null;
    createdAt: string;
  };

  export type CreateTransaction = Omit<Transaction, "id" | "createdAt">;
