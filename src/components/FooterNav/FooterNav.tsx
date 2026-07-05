import type { FooterTab } from '../../types/footerTab';
import incomeIcon from '../../assets/icons/navigation/income.svg';
import incomeActiveIcon from '../../assets/icons/navigation/income-active.svg';
import expenseIcon from '../../assets/icons/navigation/expense.svg';
import expenseActiveIcon from '../../assets/icons/navigation/expense-active.svg';
import historyIcon from '../../assets/icons/navigation/history.svg';
import historyActiveIcon from '../../assets/icons/navigation/history-active.svg';
import styles from './FooterNav.module.css';

type FooterNavProps = {
  activeTab: FooterTab;
  setActiveTab: (tab: FooterTab) => void;
};

export const FooterNav = ({ activeTab, setActiveTab }: FooterNavProps) => {
  const isIncomeActive = activeTab === 'income';
  const isExpenseActive = activeTab === 'expense';
  const isHistoryActive = activeTab === 'history';
  return (
    <footer className={styles.footer}>
      <button
        className={`${styles.button} ${isIncomeActive ? styles.active : ''}`}
        onClick={() => setActiveTab('income')}
      >
        <img className={styles.icon} src={isIncomeActive ? incomeActiveIcon : incomeIcon} alt="" />
        <span>もらう</span>
      </button>
      <button
        className={`${styles.button} ${isExpenseActive ? styles.active : ''}`}
        onClick={() => setActiveTab('expense')}
      >
        <img
          className={styles.icon}
          src={isExpenseActive ? expenseActiveIcon : expenseIcon}
          alt=""
        />
        <span>つかう</span>
      </button>
      <button
        className={`${styles.button} ${isHistoryActive ? styles.active : ''}`}
        onClick={() => setActiveTab('history')}
      >
        <img
          className={styles.icon}
          src={isHistoryActive ? historyActiveIcon : historyIcon}
          alt=""
        />
        <span>りれき</span>
      </button>
    </footer>
  );
};
