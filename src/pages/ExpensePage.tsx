import { useState } from 'react';
import { FormBottomSheet } from '../components/BottomSheet/FormBottomSheet';
import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template, CreateTemplate } from '../types/template';
import type { CreateTransaction } from '../types/transaction';
import { FloatingActionButton } from '../components/FloatingActionButton/FloatingActionButton';

// ======= Props =======
type ExpensePageProps = {
  onAddTransaction: (transaction: CreateTransaction) => void;
  onAddTemplate: (template: CreateTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  showToast: (message: string) => void;
  balance: number;
  templates: Template[];
};

export const ExpensePage = ({
  onAddTransaction,
  onAddTemplate,
  onDeleteTemplate,
  showToast,
  balance,
  templates,
}: ExpensePageProps) => {
  // ======= State =======
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // ======= 表示用expenseテンプレート =======
  const expenseTemplates = templates.filter((template) => template.transactionType === 'expense');

  // ======= フォーム制御 =======
  const handleClose = () => {
    setIsOpen(false);
    setSelectedTemplate(null);
  };

  // ======= UI =======
  return (
    <>
      {expenseTemplates.length === 0 && (
        <div>
          <p>テンプレートをつくってね</p>
        </div>
      )}
      <div>
        <h2>つかう</h2>
      </div>
      {expenseTemplates.map((template) => (
        <TemplateCard
          key={template.id}
          template={template}
          onClick={() => {
            setSelectedTemplate(template);
            setIsOpen(true);
          }}
          onDelete={onDeleteTemplate}
          showToast={showToast}
        />
      ))}
      <FloatingActionButton
        onClick={() => {
          setSelectedTemplate(null);
          setIsOpen(true);
        }}
      />
      <FormBottomSheet
        isOpen={isOpen}
        onClose={handleClose}
        template={selectedTemplate}
        transactionType={'expense'}
        onAddTransaction={onAddTransaction}
        onAddTemplate={onAddTemplate}
        balance={balance}
        showToast={showToast}
      />
    </>
  );
};
