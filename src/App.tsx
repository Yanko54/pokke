import { Header } from './components/Header/Header';
import { Balance } from './components/Balance/Balance';
import { FooterNav } from './components/FooterNav/FooterNav';
import { useState } from 'react';
import type { FooterTab } from './types/footerTab';
import { IncomePage } from './pages/IncomePage';
import { ExpensePage } from './pages/ExpensePage';
import { HistoryPage } from './pages/HistoryPage';
import type { Transaction } from './types/transaction';

function App() {
  const [activeTab, setActiveTab] = useState<FooterTab>('income');
  const [transactions, setTransactions] = useState<Transaction[]>([]);

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

  return (
    <>
      <Header childName="ひまり" />
      <Balance amount={balance} />
      {activeTab === 'income' && <IncomePage onAddTransaction={handleAddTransaction} />}
      {activeTab === 'expense' && <ExpensePage onAddTransaction={handleAddTransaction} />}
      {activeTab === 'history' && <HistoryPage transactions={transactions} />}
      <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
