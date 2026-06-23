import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { FooterNav } from './components/FooterNav';
import { useState } from 'react';
import type { FooterTab } from './types/footerTab';
import { IncomePage } from './pages/IncomePage';
import { ExpensePage } from './pages/ExpensePage';
import { HistoryPage } from './pages/HistoryPage';

function App() {
  const [activeTab, setActiveTab] = useState<FooterTab>('income');

  return (
    <>
      <Header childName="ひまり" />
      <Balance amount={1250} />
      {activeTab === 'income' && <IncomePage />}
      {activeTab === 'expense' && <ExpensePage />}
      {activeTab === 'history' && <HistoryPage />}
      <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
