import { useState } from 'react';
import { TemplateCard } from '../../components/TemplateCard/TemplateCard';
import { CreateTemplateCard } from '../../components/CreateTemplateCard/CreateTemplateCard ';
import { FormBottomSheet } from '../../components/BottomSheet/FormBottomSheet';
import { FloatingActionButton } from '../../components/FloatingActionButton/FloatingActionButton';
import type { Template, CreateTemplate } from '../../types/template';
import type { CreateTransaction } from '../../types/transaction';
import incomeTitle from '../../assets/icons/navigation/income-title.svg';
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
  const [mode, setMode] = useState<'transaction' | 'template'>('transaction');

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
        <div className={styles.grid}>
          {incomeTemplates.map((template) => (
            <TemplateCard
              // 既存テンプレート展開
              key={template.id}
              template={template}
              onClick={() => {
                setSelectedTemplate(template);
                setMode('transaction');
                setIsOpen(true);
              }}
              onDelete={onDeleteTemplate}
              showToast={showToast}
            />
          ))}
          <CreateTemplateCard
            // 新規テンプレート作成
            onClick={() => {
              setSelectedTemplate(null);
              setMode('template');
              setIsOpen(true);
            }}
          />
        </div>
      </div>
      <FloatingActionButton
        onClick={() => {
          setSelectedTemplate(null);
          setMode('transaction');
          setIsOpen(true);
        }}
      />
      {isOpen && (
        <FormBottomSheet
          isOpen={isOpen}
          onClose={handleClose}
          mode={mode}
          template={selectedTemplate}
          transactionType={'income'}
          onAddTransaction={onAddTransaction}
          onAddTemplate={onAddTemplate}
          balance={balance}
          showToast={showToast}
        />
      )}
    </div>
  );
};
