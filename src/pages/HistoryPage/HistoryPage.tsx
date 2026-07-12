import { useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard/HistoryCard';
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl';
import historyTitle from '../../assets/icons/navigation/history-title.svg';
import type { Transaction } from '../../types/transaction';
import styles from './HistoryPage.module.css';

// ======= Props =======
type HistoryPageProps = {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => boolean;
  showToast: (message: string) => void;
};
type FilterType = 'all' | 'income' | 'expense';
type FilterOption = {
  value: FilterType;
  label: string;
};

export const HistoryPage = ({ transactions, onDeleteTransaction, showToast }: HistoryPageProps) => {
  // ======= State =======
  const [filterType, setFilterType] = useState<FilterType>('all');
  // セグメントコントロール
  const filterOptions: FilterOption[] = [
    { value: 'all', label: 'すべて' },
    { value: 'income', label: 'もらった' },
    { value: 'expense', label: 'つかった' },
  ];
  // フィルタリング
  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType === 'all') return true;
    return transaction.transactionType === filterType;
  });

  // 日付降順でソート
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  // ======= UI =======
  return (
    <div className={styles.historyPage}>
      <div className={styles.title}>
        <img className={styles.icon} src={historyTitle} alt="" />
        <h2>りれき</h2>
      </div>
      <div className={styles.filter}>
        <SegmentedControl
          options={filterOptions}
          value={filterType}
          onChange={setFilterType}
          size="sm"
        />
      </div>
      <div className={styles.content}>
        <div className={styles.list}>
          {sortedTransactions.map((transaction) => (
            <HistoryCard
              key={transaction.id}
              transaction={transaction}
              onDelete={onDeleteTransaction}
              showToast={showToast}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
