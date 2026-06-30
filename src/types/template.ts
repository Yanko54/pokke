import type { TransactionType } from "./transaction";

export type Template = {
    id: string;
    transactionType: TransactionType;
    icon: string;
    amount: number;
    memo: string | null;
    order: number;
    createdAt: string;
  };

  export type CreateTemplate = Omit<Template, "id" | "order" | "createdAt">;
