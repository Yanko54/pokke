import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template } from '../types/template';

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

export const ExpensePage = () => {
  return (
    <main>
      {expenseTemplates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </main>
  );
};
