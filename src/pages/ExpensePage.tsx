import { useState } from 'react';
import { FormBottomSheet } from '../components/BottomSheet/FormBottomSheet';
import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template } from '../types/template';
import type { Transaction } from '../types/transaction';

type ExpensePageProps = {
  onAddTransaction: (transaction: Transaction) => void;
  onAddTemplate: (template: Template) => void;
  balance: number;
  templates: Template[];
};

export const ExpensePage = ({
  onAddTransaction,
  onAddTemplate,
  balance,
  templates,
}: ExpensePageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  //  フォームを閉じる処理
  const handleClose = () => {
    setIsOpen(false);
    setSelectedTemplate(null);
  };
  // expenseに絞り込み
  const expenseTemplates = templates.filter((template) => template.transactionType === 'expense');

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
      <FormBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        template={selectedTemplate}
        transactionType={'expense'}
        onAddTransaction={onAddTransaction}
        onAddTemplate={onAddTemplate}
        balance={balance}
      />
    </>
  );
};
