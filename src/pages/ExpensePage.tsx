import { useState } from 'react';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';
import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template } from '../types/template';
import type { Transaction } from '../types/transaction';

type ExpensePageProps = {
  onAddTransaction: (transaction: Transaction) => void;
  balance: number;
};

const expenseTemplates: Template[] = [
  {
    id: '1',
    transactionType: 'expense',
    icon: '🍪',
    memo: 'おかし',
    amount: 100,
    order: 1,
    createdAt: '2026/6/22',
  },
  {
    id: '2',
    transactionType: 'expense',
    icon: '🧸',
    memo: 'ガチャガチャ',
    amount: 300,
    order: 2,
    createdAt: '2026/6/22',
  },
];

export const ExpensePage = ({ onAddTransaction, balance }: ExpensePageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <>
      {expenseTemplates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onClick={() => {
            setSelectedTemplate(template);
            setIsOpen(true);
          }}
        />
      ))}
      <BottomSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        template={selectedTemplate}
        transactionType={'expense'}
        onAddTransaction={onAddTransaction}
        balance={balance}
      />
    </>
  );
};
