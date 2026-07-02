export type Child = {
    id: string;
    name: string;
    createdAt: string;
    updatedAt: string;
  };

export type CreateChild = Omit<Child, "id" | "createdAt" | "updatedAt">;