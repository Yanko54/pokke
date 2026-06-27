import { useState } from 'react';
import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template } from '../types/template';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';
import type { Transaction } from '../types/transaction';

type IncomePageProps = {
  onAddTransaction: (transaction: Transaction) => void;
};

const incomeTemplates: Template[] = [
  {
    id: '1',
    transactionType: 'income',
    icon: '👕',
    memo: 'せんたくをたたむ',
    amount: 20,
    order: 1,
    createdAt: '2026/6/22',
  },
  {
    id: '2',
    transactionType: 'income',
    icon: '🌱',
    memo: 'みずやり',
    amount: 10,
    order: 2,
    createdAt: '2026/6/22',
  },
];

export const IncomePage = ({ onAddTransaction }: IncomePageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  return (
    <>
      {incomeTemplates.map((template) => (
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
        transactionType={'income'}
        onAddTransaction={onAddTransaction}
      />
    </>
  );
};
