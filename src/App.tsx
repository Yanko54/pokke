import { Header } from './components/Header';
import { Balance } from './components/Balance';
import { FooterNav } from './components/FooterNav';
import { useState } from 'react';
import type { FooterTab } from './types/footerTab';

function App() {
  const [activeTab, setActiveTab] = useState<FooterTab>('income');

  return (
    <>
      <Header childName="ひまり" />
      <Balance amount={1250} />
      <FooterNav activeTab={activeTab} setActiveTab={setActiveTab} />
    </>
  );
}

export default App;
