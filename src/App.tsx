import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Balance } from './components/Balance/Balance';
import { FooterNav } from './components/FooterNav/FooterNav';
import { Toast } from './components/Toast/Toast';
import { IncomePage } from './pages/TransactionPage/IncomePage';
import { ExpensePage } from './pages/TransactionPage/ExpensePage';
import { HistoryPage } from './pages/HistoryPage/HistoryPage';
import { WelcomePage } from './pages/WelcomePage/WelcomePage';
import type { FooterTab } from './types/footerTab';
import type { Transaction, CreateTransaction } from './types/transaction';
import type { Template, CreateTemplate } from './types/template';
import type { Child, CreateChild } from './types/child';
import styles from './App.module.css';

const createId = () => {
  if (typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
    setTransactions((prev) => prev.filter((transaction) => transaction.id !== id));
  };

  // ======= テンプレート追加・削除 =======
  const handleAddTemplate = (template: CreateTemplate) => {
    setTemplates((prev) => [
      ...prev,
      {
        ...template,
        id: createId(),
        order: prev.length + 1,
        createdAt: new Date().toISOString(),
      },
    ]);
  };
  const handleDeleteTemplate = (id: string) => {
    setTemplates((prev) => prev.filter((template) => template.id !== id));
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
            onDeleteTemplate={handleDeleteTemplate}
            balance={balance}
            templates={templates}
            showToast={showToast}
          />
        )}
        {activeTab === 'expense' && (
          <ExpensePage
            onAddTransaction={handleAddTransaction}
            onAddTemplate={handleAddTemplate}
            onDeleteTemplate={handleDeleteTemplate}
            balance={balance}
            templates={templates}
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
