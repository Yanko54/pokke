import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Balance } from './components/Balance/Balance';
import { FooterNav } from './components/FooterNav/FooterNav';
import { Toast } from './components/Toast/Toast';
import { IncomePage } from './pages/TransactionPage/IncomePage';
import { ExpensePage } from './pages/TransactionPage/ExpensePage';
import { HistoryPage } from './pages/HistoryPage/HistoryPage';
import { WelcomePage } from './pages/WelcomePage/WelcomePage';
import { ChildSheet } from './components/ChildSheet/ChildSheet';
import { arrayMove } from '@dnd-kit/sortable';
import type { FooterTab } from './types/footerTab';
import type {
  Transaction,
  TransactionType,
  CreateTransaction,
  UpdateTransaction,
  UpdateTransactionResult,
} from './types/transaction';
import type { Template, CreateTemplate, UpdateTemplate } from './types/template';
import type { Child } from './types/child';
import styles from './App.module.css';

const createId = () => {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

// 子どもとtransactionTypeごとのテンプレートをorder順で取得
const getTemplatesByType = (
  templates: Template[],
  childId: string,
  transactionType: TransactionType,
) => {
  return templates
    .filter(
      (template) => template.childId === childId && template.transactionType === transactionType,
    )
    .sort((a, b) => a.order - b.order);
};

// テンプレートのorderを1から振り直す
const resetTemplateOrder = (templates: Template[]) => {
  return templates.map((template, index) => ({
    ...template,
    order: index + 1,
  }));
};

// 旧childをchildrenへ移し、旧データに不足しているchildIdだけを補完する。
// 個別キーの保存が途中で止まっても、次回起動時に同じ処理を続けられる。
const loadInitialData = () => {
  const savedChildren = localStorage.getItem('children');
  const savedChild = localStorage.getItem('child');
  const legacyChild: Child | null = savedChild ? JSON.parse(savedChild) : null;
  const children: Child[] =
    savedChildren !== null ? JSON.parse(savedChildren) : legacyChild ? [legacyChild] : [];
  const migrationChildId = legacyChild?.id ?? children[0]?.id;

  const savedTransactions = localStorage.getItem('transactions');
  const transactions: Transaction[] = savedTransactions
    ? (JSON.parse(savedTransactions) as Transaction[]).map((transaction) =>
        !transaction.childId && migrationChildId
          ? { ...transaction, childId: migrationChildId }
          : transaction,
      )
    : [];
  const savedTemplates = localStorage.getItem('templates');
  const templates: Template[] = savedTemplates
    ? (JSON.parse(savedTemplates) as Template[]).map((template) =>
        !template.childId && migrationChildId
          ? { ...template, childId: migrationChildId }
          : template,
      )
    : [];

  const savedSelectedChildId = localStorage.getItem('selectedChildId');
  const selectedId: string | null = savedSelectedChildId ? JSON.parse(savedSelectedChildId) : null;
  const selectedChildId = children.some((child) => child.id === selectedId)
    ? selectedId
    : (children[0]?.id ?? null);

  return { children, selectedChildId, transactions, templates };
};

type ChildSheet = { mode: 'add' } | { mode: 'edit'; childId: string } | null;

function App() {
  // ======= State =======
  const [activeTab, setActiveTab] = useState<FooterTab>('income');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [childSheet, setChildSheet] = useState<ChildSheet>(null);
  const [initialData] = useState(loadInitialData);
  const [children, setChildren] = useState<Child[]>(initialData.children);
  const [selectedChildId, setSelectedChildId] = useState<string | null>(
    initialData.selectedChildId,
  );
  const [transactions, setTransactions] = useState<Transaction[]>(initialData.transactions);
  const [templates, setTemplates] = useState<Template[]>(initialData.templates);
  const selectedChild = children.find((child) => child.id === selectedChildId) ?? null;
  const editedChild =
    childSheet?.mode === 'edit'
      ? children.find((child) => child.id === childSheet.childId) ?? null
      : null;
  const selectedTransactions = transactions.filter(
    (transaction) => transaction.childId === selectedChildId,
  );

  // ======= 残高計算 =======
  const balance = selectedTransactions.reduce((acc, transaction) => {
    return transaction.transactionType === 'income'
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  // ======= 取引追加・削除 =======
  const handleAddTransaction = (transaction: CreateTransaction) => {
    if (!selectedChildId) return;
    setTransactions((prev) => [
      ...prev,
      {
        ...transaction,
        id: createId(),
        childId: selectedChildId,
        createdAt: new Date().toISOString(),
        updatedAt: null,
      },
    ]);
  };
  const handleDeleteTransaction = (id: string) => {
    const targetTransaction = transactions.find(
      (transaction) => transaction.id === id && transaction.childId === selectedChildId,
    );

    if (!targetTransaction) return false;
    if (targetTransaction.transactionType === 'income' && balance - targetTransaction.amount < 0) {
      return false;
    }

    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    return true;
  };

  const handleUpdateTransaction = (
    id: string,
    updatedTransaction: UpdateTransaction,
  ): UpdateTransactionResult => {
    const targetTransaction = transactions.find(
      (transaction) => transaction.id === id && transaction.childId === selectedChildId,
    );
    if (!targetTransaction) return 'notFound';

    // 編集後のマイナス残高防止バリデーション
    const baseBalance =
      targetTransaction.transactionType === 'income'
        ? balance - targetTransaction.amount
        : balance + targetTransaction.amount;
    const nextBalance =
      updatedTransaction.transactionType === 'income'
        ? baseBalance + updatedTransaction.amount
        : baseBalance - updatedTransaction.amount;

    if (nextBalance < 0) {
      return 'notEnoughBalance';
    }

    setTransactions((prev) =>
      prev.map((transaction) =>
        transaction.id === id
          ? {
              ...transaction,
              ...updatedTransaction,
              updatedAt: new Date().toISOString(),
            }
          : transaction,
      ),
    );

    return 'success';
  };

  // ======= テンプレート処理 =======
  const incomeTemplates = selectedChildId
    ? getTemplatesByType(templates, selectedChildId, 'income')
    : [];
  const expenseTemplates = selectedChildId
    ? getTemplatesByType(templates, selectedChildId, 'expense')
    : [];

  // 追加作成
  const handleAddTemplate = (template: CreateTemplate) => {
    if (!selectedChildId) return;
    setTemplates((prev) => {
      const sameTypeTemplates = getTemplatesByType(prev, selectedChildId, template.transactionType);
      const nextOrder = Math.max(...sameTypeTemplates.map((item) => item.order), 0) + 1;
      return [
        ...prev,
        {
          ...template,
          id: createId(),
          childId: selectedChildId,
          order: nextOrder,
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  // 編集
  const handleUpdateTemplate = (id: string, updatedTemplate: UpdateTemplate): void => {
    setTemplates((prev) => {
      const targetTemplate = prev.find(
        (template) => template.id === id && template.childId === selectedChildId,
      );
      if (!targetTemplate) return prev;

      const { transactionType, icon, amount, memo } = updatedTemplate;
      const isTypeChanged = targetTemplate.transactionType !== transactionType;
      const nextOrder = isTypeChanged
        ? Math.max(
            ...getTemplatesByType(prev, targetTemplate.childId, transactionType).map(
              (template) => template.order,
            ),
            0,
          ) + 1
        : targetTemplate.order;

      // 移動元の表示順を保ったまま、残りのorderを連番にする
      const remainingTemplates = isTypeChanged
        ? resetTemplateOrder(
            getTemplatesByType(prev, targetTemplate.childId, targetTemplate.transactionType).filter(
              (template) => template.id !== id,
            ),
          )
        : [];
      const remainingOrders = new Map(
        remainingTemplates.map((template) => [template.id, template.order]),
      );

      return prev.map((template) => {
        if (template.id === id) {
          return { ...template, transactionType, icon, amount, memo, order: nextOrder };
        }

        const order = remainingOrders.get(template.id);
        return order === undefined ? template : { ...template, order };
      });
    });
  };

  // 削除
  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => {
      const targetTemplate = prev.find(
        (template) => template.id === id && template.childId === selectedChildId,
      );

      if (!targetTemplate) return prev;

      const remainingTemplates = resetTemplateOrder(
        getTemplatesByType(prev, targetTemplate.childId, targetTemplate.transactionType).filter(
          (template) => template.id !== id,
        ),
      );
      const remainingOrders = new Map(
        remainingTemplates.map((template) => [template.id, template.order]),
      );

      return prev
        .filter((template) => template.id !== id)
        .map((template) => {
          const order = remainingOrders.get(template.id);
          return order === undefined ? template : { ...template, order };
        });
    });
  };

  // 並び替え
  const handleReorderTemplates = (
    transactionType: TransactionType,
    activeId: string,
    overId: string,
  ) => {
    if (!selectedChildId) return;
    setTemplates((prev) => {
      const targetTemplates = getTemplatesByType(prev, selectedChildId, transactionType);
      // 掴んだカードの位置
      const oldIndex = targetTemplates.findIndex((template) => template.id === activeId);
      // 移動先カードの位置
      const newIndex = targetTemplates.findIndex((template) => template.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      // 並び替えて、orderも新しい順番に更新
      const reorderedTemplates = resetTemplateOrder(arrayMove(targetTemplates, oldIndex, newIndex));

      const reorderedOrders = new Map(
        reorderedTemplates.map((template) => [template.id, template.order]),
      );
      return prev.map((template) => {
        const order = reorderedOrders.get(template.id);
        return order === undefined ? template : { ...template, order };
      });
    });
  };

  // ======= 子ども追加・選択・編集 =======
  const isDuplicateChildName = (name: string, ignoredChildId?: string) =>
    children.some((child) => child.id !== ignoredChildId && child.name.trim() === name);

  const validateNewChildName = (name: string): string | null =>
    isDuplicateChildName(name) ? 'おなじなまえのこどもがいます' : null;

  const validateEditedChildName = (name: string, childId: string): string | null =>
    isDuplicateChildName(name, childId) ? 'おなじなまえのこどもがいます' : null;

  const handleAddChild = (name: string): string | null => {
    const error = validateNewChildName(name);
    if (error) return error;
    const now = new Date().toISOString();
    const newChild = {
      name,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    };
    setChildren((prev) => [...prev, newChild]);
    setSelectedChildId(newChild.id);
    setChildSheet(null);
    return null;
  };

  const handleSelectChild = (id: string) => {
    if (!children.some((child) => child.id === id)) return;
    setChildSheet(null);
    setSelectedChildId(id);
  };

  const handleUpdateChild = (id: string, name: string): string | null => {
    const target = children.find((child) => child.id === id);
    if (!target) return 'こどもがみつかりません';
    if (name === target.name.trim()) return 'なまえがかわっていません';
    const error = validateEditedChildName(name, id);
    if (error) return error;
    setChildren((prev) =>
      prev.map((child) =>
        child.id === id
          ? { ...child, name, updatedAt: new Date().toISOString() }
          : child,
      ),
    );
    setChildSheet(null);
    return null;
  };

  // ======= トースト表示 =======
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 1500);
  };

  // ======= localStorage保存 =======
  useEffect(() => {
    localStorage.setItem('children', JSON.stringify(children));
  }, [children]);

  useEffect(() => {
    localStorage.setItem('selectedChildId', JSON.stringify(selectedChildId));
  }, [selectedChildId]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  // ======= UI =======
  return selectedChild === null ? (
    <WelcomePage onAddChild={handleAddChild} validateName={validateNewChildName} />
  ) : (
    <div className={styles.app}>
      <Header
        children={children}
        selectedChildId={selectedChild.id}
        onSelectChild={handleSelectChild}
        onAddChild={() => setChildSheet({ mode: 'add' })}
        onEditChild={(childId) => setChildSheet({ mode: 'edit', childId })}
      />
      <Balance amount={balance} />
      <main key={selectedChildId} className={styles.main}>
        {activeTab === 'income' && (
          <IncomePage
            onAddTransaction={handleAddTransaction}
            onAddTemplate={handleAddTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onReorderTemplates={handleReorderTemplates}
            onDeleteTemplate={handleDeleteTemplate}
            balance={balance}
            incomeTemplates={incomeTemplates}
            showToast={showToast}
          />
        )}
        {activeTab === 'expense' && (
          <ExpensePage
            onAddTransaction={handleAddTransaction}
            onAddTemplate={handleAddTemplate}
            onUpdateTemplate={handleUpdateTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            onReorderTemplates={handleReorderTemplates}
            balance={balance}
            expenseTemplates={expenseTemplates}
            showToast={showToast}
          />
        )}
        {activeTab === 'history' && (
          <HistoryPage
            transactions={selectedTransactions}
            onDeleteTransaction={handleDeleteTransaction}
            onUpdateTransaction={handleUpdateTransaction}
            showToast={showToast}
          />
        )}
      </main>
      <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
      <ChildSheet
        key={
          childSheet?.mode === 'edit'
            ? `child-sheet-edit-${childSheet.childId}`
            : 'child-sheet-add'
        }
        isOpen={childSheet !== null}
        mode={childSheet?.mode ?? 'add'}
        initialName={editedChild?.name}
        validateName={
          editedChild
            ? (name) => validateEditedChildName(name, editedChild.id)
            : validateNewChildName
        }
        onSubmit={
          editedChild ? (name) => handleUpdateChild(editedChild.id, name) : handleAddChild
        }
        onClose={() => setChildSheet(null)}
      />
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default App;
