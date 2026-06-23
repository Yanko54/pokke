import type { FooterTab } from '../../types/footerTab';
import styles from './FooterNav.module.css';

type FooterNavProps = {
  activeTab: FooterTab;
  setActiveTab: (tab: FooterTab) => void;
};

export const FooterNav = ({ activeTab, setActiveTab }: FooterNavProps) => {
  return (
    <footer className={styles.footernav}>
      <button onClick={() => setActiveTab('income')}>もらう</button>
      <button onClick={() => setActiveTab('expense')}>つかう</button>
      <button onClick={() => setActiveTab('history')}>りれき</button>
    </footer>
  );
};
