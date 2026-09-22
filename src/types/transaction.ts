 export type TransactionType =
  | 'income'
  | 'expense';
 
 export type Transaction = {
    id: string;
    childId: string;
    templateId: string | null
    transactionType: TransactionType;
    icon: string;
    amount: number;
    memo: string | null;
    createdAt: string;
    updatedAt?: string | null;
  };

export type CreateTransaction = Omit<Transaction, "id" | "childId" | "createdAt" | "updatedAt">;
export type UpdateTransaction = Pick<Transaction, "transactionType" | "icon" | "amount" | "memo">;

export type UpdateTransactionResult =
  | 'success'
  | 'notFound'
  | 'notEnoughBalance';  

  
