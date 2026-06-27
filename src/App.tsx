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
  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => {
      const nextTransactions = [...prev, transaction];
      console.log('更新後transactions', nextTransactions);
      return nextTransactions;
    });
  };

  return (
    <>
      <Header childName="ひまり" />
      <Balance amount={1250} />
      {activeTab === 'income' && <IncomePage onAddTransaction={handleAddTransaction} />}
      {activeTab === 'expense' && <ExpensePage />}
      {activeTab === 'history' && <HistoryPage />}
      <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
