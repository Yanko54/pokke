import { useState } from 'react';
import { TemplateCard } from '../../components/TemplateCard/TemplateCard';
import { CreateTemplateCard } from '../../components/CreateTemplateCard/CreateTemplateCard ';
import { FormBottomSheet } from '../../components/BottomSheet/FormBottomSheet';
import { FloatingActionButton } from '../../components/FloatingActionButton/FloatingActionButton';
import { DndContext } from '@dnd-kit/core';
import { SortableContext, rectSortingStrategy } from '@dnd-kit/sortable';
import type { DragEndEvent } from '@dnd-kit/core';
import type { Template, CreateTemplate } from '../../types/template';
import type { CreateTransaction } from '../../types/transaction';
import incomeTitle from '../../assets/icons/navigation/income-title.svg';
import reorderTitle from '../../assets/icons/navigation/reorder-title.svg';
import styles from './TransactionPage.module.css';

// ======= Props =======
type IncomePageProps = {
  onAddTransaction: (transaction: CreateTransaction) => void;
  onAddTemplate: (template: CreateTemplate) => void;
  onDeleteTemplate: (id: string) => void;
  onReorderTemplates: (
    transactionType: 'income' | 'expense',
    activeId: string,
    overId: string,
  ) => void;
  showToast: (message: string) => void;
  balance: number;
  incomeTemplates: Template[];
};

export const IncomePage = ({
  onAddTransaction,
  onAddTemplate,
  onDeleteTemplate,
  onReorderTemplates,
  showToast,
  balance,
  incomeTemplates,
}: IncomePageProps) => {
  // ======= State =======
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [mode, setMode] = useState<'transaction' | 'template'>('transaction');
  const [isReordering, setIsReordering] = useState(false);

  // ======= フォーム制御 =======
  const handleClose = () => {
    setIsOpen(false);
    setSelectedTemplate(null);
  };

  // ======= テンプレ並び替え確定 =======
  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) return;
    if (active.id === over.id) return;

    onReorderTemplates('income', String(active.id), String(over.id));
  };

  // ======= UI =======
  return (
    <div className={styles.transactionPage}>
      <div className={styles.sectionHeader}>
        <div className={styles.title}>
          <img className={styles.icon} src={isReordering ? reorderTitle : incomeTitle} alt="" />
          <h2>{isReordering ? 'ならびかえ' : 'もらう'}</h2>
        </div>
        <button
          type="button"
          className={`${styles.reorderButton} ${isReordering ? styles.finishButton : ''}`}
          onClick={() => setIsReordering((prev) => !prev)}
          aria-label={isReordering ? '並び替えを終了する' : 'テンプレートを並び替える'}
        >
          {isReordering ? 'おわり' : '⇅'}
        </button>
      </div>
      <div className={`${styles.content} ${isReordering ? styles.reorderingPage : ''}`}>
        <DndContext onDragEnd={handleDragEnd}>
          <SortableContext
            items={incomeTemplates.map((template) => template.id)}
            strategy={rectSortingStrategy}
          >
            <div className={styles.grid}>
              {incomeTemplates.map((template) => (
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
                  // 新規テンプレート作成
                  onClick={() => {
                    setSelectedTemplate(null);
                    setMode('template');
                    setIsOpen(true);
                  }}
                />
              )}
            </div>
          </SortableContext>
        </DndContext>
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
