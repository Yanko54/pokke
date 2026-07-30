import { useState } from 'react';
import { FormBottomSheet } from '../../components/BottomSheet/FormBottomSheet';
import { TemplateCard } from '../../components/TemplateCard/TemplateCard';
import { CreateTemplateCard } from '../../components/CreateTemplateCard/CreateTemplateCard ';
import { FloatingActionButton } from '../../components/FloatingActionButton/FloatingActionButton';
import type { Template, CreateTemplate } from '../../types/template';
import type { CreateTransaction } from '../../types/transaction';
import expenseTitle from '../../assets/icons/navigation/expense-title.svg';
import reorderTitle from '../../assets/icons/navigation/reorder-title.svg';
import styles from './TransactionPage.module.css';

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
  const [mode, setMode] = useState<'transaction' | 'template'>('transaction');
  const [isReordering, setIsReordering] = useState(false);

  // ======= 表示用expenseテンプレート =======
  const expenseTemplates = templates.filter((template) => template.transactionType === 'expense');

  // ======= フォーム制御 =======
  const handleClose = () => {
    setIsOpen(false);
    setSelectedTemplate(null);
  };

  // ======= UI =======
  return (
    <div className={styles.transactionPage}>
      <div className={styles.sectionHeader}>
        <div className={styles.title}>
          <img className={styles.icon} src={isReordering ? reorderTitle : expenseTitle} alt="" />
          <h2>{isReordering ? 'ならびかえ' : 'つかう'}</h2>
        </div>
        <button
          type="button"
          className={styles.reorderButton}
          onClick={() => setIsReordering((prev) => !prev)}
          aria-label={isReordering ? '並び替えを終了する' : 'テンプレートを並び替える'}
        >
          {isReordering ? 'おわり' : '⇅'}
        </button>
      </div>
      <div className={styles.content}>
        <div className={styles.grid}>
          {expenseTemplates.map((template) => (
            <TemplateCard
              // 既存テンプレート展開
              key={template.id}
              template={template}
              isReordering={isReordering}
              onClick={() => {
                if (isReordering) return;
                setSelectedTemplate(template);
                setMode('transaction');
                setIsOpen(true);
              }}
              onDelete={onDeleteTemplate}
              showToast={showToast}
            />
          ))}
          {!isReordering && (
            <CreateTemplateCard
              onClick={() => {
                setSelectedTemplate(null);
                setMode('template');
                setIsOpen(true);
              }}
            />
          )}{' '}
        </div>
      </div>
      {!isReordering && (
        <FloatingActionButton
          onClick={() => {
            setSelectedTemplate(null);
            setMode('transaction');
            setIsOpen(true);
          }}
        />
      )}
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
