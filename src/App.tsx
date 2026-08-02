import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Balance } from './components/Balance/Balance';
import { FooterNav } from './components/FooterNav/FooterNav';
import { Toast } from './components/Toast/Toast';
import { IncomePage } from './pages/TransactionPage/IncomePage';
import { ExpensePage } from './pages/TransactionPage/ExpensePage';
import { HistoryPage } from './pages/HistoryPage/HistoryPage';
import { WelcomePage } from './pages/WelcomePage/WelcomePage';
import { arrayMove } from '@dnd-kit/sortable';
import type { FooterTab } from './types/footerTab';
import type { Transaction, CreateTransaction, TransactionType } from './types/transaction';
import type { Template, CreateTemplate } from './types/template';
import type { Child, CreateChild } from './types/child';
import styles from './App.module.css';

const createId = () => {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

// 処理タイプごとのテンプレートをorder順に取得
const getTemplatesByType = (templates: Template[], transactionType: TransactionType) => {
  return templates
    .filter((template) => template.transactionType === transactionType)
    .sort((a, b) => a.order - b.order);
};

// テンプレートのorderを1から振り直す
const resetTemplateOrder = (templates: Template[]) => {
  return templates.map((template, index) => ({
    ...template,
    order: index + 1,
  }));
};

function App() {
  // ======= State =======
  const [activeTab, setActiveTab] = useState<FooterTab>('income');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const savedTransactions = localStorage.getItem('transactions');
    return savedTransactions ? JSON.parse(savedTransactions) : [];
  });
  const [templates, setTemplates] = useState<Template[]>(() => {
    const savedTemplates = localStorage.getItem('templates');
    return savedTemplates ? JSON.parse(savedTemplates) : [];
  });
  const [child, setChild] = useState<Child | null>(() => {
    const savedChild = localStorage.getItem('child');
    return savedChild ? JSON.parse(savedChild) : null;
  });

  // ======= 残高計算 =======
  const balance = transactions.reduce((acc, transaction) => {
    return transaction.transactionType === 'income'
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  // ======= 取引追加・削除 =======
  const handleAddTransaction = (transaction: CreateTransaction) => {
    setTransactions((prev) => [
      ...prev,
      { ...transaction, id: createId(), createdAt: new Date().toISOString() },
    ]);
  };
  const handleDeleteTransaction = (id: string) => {
    const targetTransaction = transactions.find((transaction) => transaction.id === id);

    if (!targetTransaction) return false;
    if (targetTransaction.transactionType === 'income' && balance - targetTransaction.amount < 0) {
      return false;
    }

    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
    return true;
  };

  // ======= テンプレート処理 =======
  const incomeTemplates = getTemplatesByType(templates, 'income');
  const expenseTemplates = getTemplatesByType(templates, 'expense');

  // 追加作成
  const handleAddTemplate = (template: CreateTemplate) => {
    setTemplates((prev) => {
      const sameTypeTemplates = getTemplatesByType(prev, template.transactionType);
      const nextOrder = Math.max(...sameTypeTemplates.map((item) => item.order), 0) + 1;
      return [
        ...prev,
        {
          ...template,
          id: createId(),
          order: nextOrder,
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  // 削除
  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => {
      const targetTemplate = prev.find((template) => template?.id === id);

      if (!targetTemplate) return prev;

      const otherTypeTemplates = prev.filter(
        (template) => template && template.transactionType !== targetTemplate.transactionType,
      );

      const remainingTemplates = resetTemplateOrder(
        prev.filter(
          (template) =>
            template &&
            template.transactionType === targetTemplate.transactionType &&
            template.id !== id,
        ),
      );

      return [...otherTypeTemplates, ...remainingTemplates];
    });
  };

  // 並び替え
  const handleReorderTemplates = (
    transactionType: TransactionType,
    activeId: string,
    overId: string,
  ) => {
    setTemplates((prev) => {
      const targetTemplates = getTemplatesByType(prev, transactionType);
      // 掴んだカードの位置
      const oldIndex = targetTemplates.findIndex((template) => template.id === activeId);
      // 移動先カードの位置
      const newIndex = targetTemplates.findIndex((template) => template.id === overId);
      if (oldIndex === -1 || newIndex === -1) return prev;

      // 並び替えて、orderも新しい順番に更新
      const reorderedTemplates = resetTemplateOrder(arrayMove(targetTemplates, oldIndex, newIndex));

      let index = 0;

      return prev.map((template) => {
        if (template.transactionType !== transactionType) {
          return template;
        }

        return reorderedTemplates[index++];
      });
    });
  };

  // ======= 子ども追加 =======
  const handleAddChild = (child: CreateChild) => {
    const now = new Date().toISOString();
    setChild({
      ...child,
      id: createId(),
      createdAt: now,
      updatedAt: now,
    });
  };

  // ======= トースト表示 =======
  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 1500);
  };

  // ======= localStorage保存 =======
  // TODO: MVP完成後、useLocalStorageカスタムフックへ切り出し検討
  useEffect(() => {
    if (child === null) return;
    localStorage.setItem('child', JSON.stringify(child));
  }, [child]);

  useEffect(() => {
    localStorage.setItem('transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('templates', JSON.stringify(templates));
  }, [templates]);

  // ======= UI =======
  return child === null ? (
    <WelcomePage onAddChild={handleAddChild} />
  ) : (
    <div className={styles.app}>
      <Header childName={child.name} />
      <Balance amount={balance} />
      <main className={styles.main}>
        {activeTab === 'income' && (
          <IncomePage
            onAddTransaction={handleAddTransaction}
            onAddTemplate={handleAddTemplate}
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
            onDeleteTemplate={handleDeleteTemplate}
            onReorderTemplates={handleReorderTemplates}
            balance={balance}
            expenseTemplates={expenseTemplates}
            showToast={showToast}
          />
        )}
        {activeTab === 'history' && (
          <HistoryPage
            transactions={transactions}
            onDeleteTransaction={handleDeleteTransaction}
            showToast={showToast}
          />
        )}
      </main>
      <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
      {toastMessage && <Toast message={toastMessage} />}
    </div>
  );
}

export default App;
