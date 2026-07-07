import { useState } from 'react';
import type { Transaction } from '../types/transaction';
import { HistoryCard } from '../components/HistoryCard/HistoryCard';
import { SegmentedControl } from '../components/SegmentedControl/SegmentedContorol';

// ======= Props =======
type HistoryPageProps = {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
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
    <>
      <div>
        <h2>りれき</h2>
        <SegmentedControl
          options={filterOptions}
          value={filterType}
          onChange={setFilterType}
          size="sm"
        />
      </div>
      {sortedTransactions.map((transaction) => (
        <HistoryCard
          key={transaction.id}
          transaction={transaction}
          onDelete={onDeleteTransaction}
          showToast={showToast}
        />
      ))}
    </>
  );
};
