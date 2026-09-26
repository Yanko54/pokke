import type { TransactionType } from "./transaction";

export type Template = {
    id: string;
    childId: string;
    transactionType: TransactionType;
    icon: string;
    amount: number;
    memo: string | null;
    order: number;
    createdAt: string;
  };

  export type CreateTemplate = Omit<Template, "id" | "childId" | "order" | "createdAt">;

export type UpdateTemplate = Pick<Template, "transactionType" | "icon" | "amount" | "memo">;
