import { useState } from 'react';
import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import { FormBottomSheet } from '../components/BottomSheet/FormBottomSheet';
import { FloatingActionButton } from '../components/FloatingActionButton/FloatingActionButton';
import type { Template, CreateTemplate } from '../types/template';
import type { CreateTransaction } from '../types/transaction';
import incomeTitle from '../assets/icons/navigation/income-title.svg';
import styles from './TransactionPage.module.css';

// ======= Props =======
type IncomePageProps = {
  onAddTransaction: (transaction: CreateTransaction) => void;
  onAddTemplate: (template: CreateTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  showToast: (message: string) => void;
  balance: number;
  templates: Template[];
};

export const IncomePage = ({
  onAddTransaction,
  onAddTemplate,
  onDeleteTemplate,
  showToast,
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
    <div className={styles.transactionPage}>
      <div className={styles.title}>
        <img className={styles.icon} src={incomeTitle} alt="" />
        <h2>もらう</h2>
      </div>
      <div className={styles.content}>
        {incomeTemplates.length === 0 && <p>テンプレートをつくってね</p>}
        <div className={styles.grid}>
          {incomeTemplates.map((template) => (
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
        </div>
      </div>
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
        showToast={showToast}
      />
    </div>
  );
};
