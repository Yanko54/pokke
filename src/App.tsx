import { Header } from './components/Header/Header';
import { Balance } from './components/Balance/Balance';
import { FooterNav } from './components/FooterNav/FooterNav';
import { useState } from 'react';
import type { FooterTab } from './types/footerTab';
import { IncomePage } from './pages/IncomePage';
import { ExpensePage } from './pages/ExpensePage';
import { HistoryPage } from './pages/HistoryPage';
import type { Transaction } from './types/transaction';
import type { Template } from './types/template';

const initialTemplates: Template[] = [
  {
    id: '1',
    transactionType: 'income',
    icon: '💰',
    memo: 'おこづかい',
    amount: 1000,
    order: 1,
    createdAt: '2026/6/22',
  },
  {
    id: '2',
    transactionType: 'income',
    icon: '👕',
    memo: 'せんたくをたたむ',
    amount: 20,
    order: 2,
    createdAt: '2026/6/22',
  },
  {
    id: '3',
    transactionType: 'income',
    icon: '🌱',
    memo: 'みずやり',
    amount: 10,
    order: 3,
    createdAt: '2026/6/22',
  },
  {
    id: '4',
    transactionType: 'expense',
    icon: '🍪',
    memo: 'おかし',
    amount: 100,
    order: 1,
    createdAt: '2026/6/22',
  },
  {
    id: '5',
    transactionType: 'expense',
    icon: '🧸',
    memo: 'ガチャ',
    amount: 300,
    order: 2,
    createdAt: '2026/6/22',
  },
];

function App() {
  const [activeTab, setActiveTab] = useState<FooterTab>('income');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [templates, setTemplates] = useState<Template[]>(initialTemplates);

  // transactionsから現在の残高を計算
  const balance = transactions.reduce((acc, transaction) => {
    return transaction.transactionType === 'income'
      ? acc + transaction.amount
      : acc - transaction.amount;
  }, 0);

  // transactionsに取引履歴を追加
  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  // templateに新しいテンプレートを追加
  const handleAddTemplate = (template: Template) => {
    setTemplates((prev) => [...prev, template]);
  };

  return (
    <>
      <Header childName="ひまり" />
      <Balance amount={balance} />
      {activeTab === 'income' && (
        <IncomePage
          onAddTransaction={handleAddTransaction}
          onAddTemplate={handleAddTemplate}
          balance={balance}
          templates={templates}
        />
      )}
      {activeTab === 'expense' && (
        <ExpensePage
          onAddTransaction={handleAddTransaction}
          onAddTemplate={handleAddTemplate}
          balance={balance}
          templates={templates}
        />
      )}
      {activeTab === 'history' && <HistoryPage transactions={transactions} />}
      <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
