import { useState, useEffect } from 'react';
import { Header } from './components/Header/Header';
import { Balance } from './components/Balance/Balance';
import { FooterNav } from './components/FooterNav/FooterNav';
import { IncomePage } from './pages/IncomePage';
import { ExpensePage } from './pages/ExpensePage';
import { HistoryPage } from './pages/HistoryPage';
import { WelcomePage } from './pages/WelcomePage';
import type { FooterTab } from './types/footerTab';
import type { Transaction, CreateTransaction } from './types/transaction';
import type { Template, CreateTemplate } from './types/template';
import type { Child, CreateChild } from './types/child';

function App() {
  // ======= State =======
  const [activeTab, setActiveTab] = useState<FooterTab>('income');
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
      { ...transaction, id: crypto.randomUUID(), createdAt: new Date().toISOString() },
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
        id: crypto.randomUUID(),
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
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    });
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
  return (
    <>
      {child === null ? (
        <WelcomePage onAddChild={handleAddChild} />
      ) : (
        <>
          <Header childName={child.name} />
          <Balance amount={balance} />
          {activeTab === 'income' && (
            <IncomePage
              onAddTransaction={handleAddTransaction}
              onAddTemplate={handleAddTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              balance={balance}
              templates={templates}
            />
          )}
          {activeTab === 'expense' && (
            <ExpensePage
              onAddTransaction={handleAddTransaction}
              onAddTemplate={handleAddTemplate}
              onDeleteTemplate={handleDeleteTemplate}
              balance={balance}
              templates={templates}
            />
          )}
          {activeTab === 'history' && (
            <HistoryPage
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          )}
          <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
        </>
      )}
    </>
  );
}

export default App;
