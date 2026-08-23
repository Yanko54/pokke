import { useState } from 'react';
import { HistoryCard } from '../../components/HistoryCard/HistoryCard';
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl';
import { BottomSheet } from '../../components/BottomSheet/BottomSheet';
import { FormContent } from '../../components/BottomSheet/FormContent';
import historyTitle from '../../assets/icons/navigation/history-title.svg';
import type {
  Transaction,
  UpdateTransaction,
  UpdateTransactionResult,
} from '../../types/transaction';
import styles from './HistoryPage.module.css';

// ======= Props =======
type HistoryPageProps = {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => boolean;
  onUpdateTransaction: (id: string, transaction: UpdateTransaction) => UpdateTransactionResult;
  showToast: (message: string) => void;
};
type FilterType = 'all' | 'income' | 'expense';
type FilterOption = {
  value: FilterType;
  label: string;
};

export const HistoryPage = ({
  transactions,
  onDeleteTransaction,
  onUpdateTransaction,
  showToast,
}: HistoryPageProps) => {
  // ======= State =======
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

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

  // フォーム制御
  const handleClose = () => {
    setSelectedTransaction(null);
  };

  // ======= UI =======
  return (
    <div className={styles.historyPage}>
      <div className={styles.sectionHeader}>
        <div className={styles.title}>
          <img className={styles.icon} src={historyTitle} alt="" />
          <h2>りれき</h2>
        </div>
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
              onEdit={setSelectedTransaction}
              onDelete={onDeleteTransaction}
              showToast={showToast}
            />
          ))}
        </div>
        <BottomSheet isOpen={selectedTransaction !== null} onClose={handleClose}>
          {selectedTransaction && (
            <FormContent
              mode="editTransaction"
              transaction={selectedTransaction}
              onUpdateTransaction={onUpdateTransaction}
              onClose={handleClose}
              showToast={showToast}
            />
          )}
        </BottomSheet>
      </div>
    </div>
  );
};
