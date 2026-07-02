import { useState } from 'react';
import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template, CreateTemplate } from '../types/template';
import { FormBottomSheet } from '../components/BottomSheet/FormBottomSheet';
import type { CreateTransaction } from '../types/transaction';
import { FloatingActionButton } from '../components/FloatingActionButton/FloatingActionButton';

// ======= Props =======
type IncomePageProps = {
  onAddTransaction: (transaction: CreateTransaction) => void;
  onAddTemplate: (template: CreateTemplate) => void;
  balance: number;
  templates: Template[];
};

export const IncomePage = ({
  onAddTransaction,
  onAddTemplate,
  balance,
  templates,
}: IncomePageProps) => {
  // ======= State =======
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);

  // ======= 表示用incomeテンプレート =======
  const incomeTemplates = templates.filter((template) => template.transactionType === 'income');

  // ======= フォーム制御 =======
  const handleClose = () => {
    setIsOpen(false);
    setSelectedTemplate(null);
  };

  // ======= UI =======
  return (
    <>
      {incomeTemplates.length === 0 && (
        <div>
          <p>テンプレートをつくってね</p>
        </div>
      )}
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
        transactionType={'income'}
        onAddTransaction={onAddTransaction}
        onAddTemplate={onAddTemplate}
        balance={balance}
      />
    </>
  );
};
