export type TransactionType =
  | 'income'
  | 'expense';

  export type Template = {
    id: string,
    type: TransactionType;
    icon: string;
    memo: string | null;
    amount: number;
    order: number;
  };
