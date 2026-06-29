import { useState } from 'react';
import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template } from '../types/template';
import { FormBottomSheet } from '../components/BottomSheet/FormBottomSheet';
import type { Transaction } from '../types/transaction';

type IncomePageProps = {
  onAddTransaction: (transaction: Transaction) => void;
  onAddTemplate: (template: Template) => void;
  balance: number;
  templates: Template[];
};

export const IncomePage = ({
  onAddTransaction,
  onAddTemplate,
  balance,
  templates,
}: IncomePageProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  //  フォームを閉じる処理
  const handleClose = () => {
    setIsOpen(false);
    setSelectedTemplate(null);
  };
  // incomeに絞り込み
  const incomeTemplates = templates.filter((template) => template.transactionType === 'income');

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
      <FormBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        template={selectedTemplate}
        transactionType={'income'}
        onAddTransaction={onAddTransaction}
        onAddTemplate={onAddTemplate}
        balance={balance}
      />
    </>
  );
};
