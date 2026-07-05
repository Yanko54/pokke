import { useState } from 'react';
import type { Transaction } from '../types/transaction';
import { HistoryCard } from '../components/HistoryCard/HistoryCard';

type HistoryPageProps = {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  showToast: (message: string) => void;
};
type FilterType = 'all' | 'income' | 'expense';

export const HistoryPage = ({ transactions, onDeleteTransaction, showToast }: HistoryPageProps) => {
  const [filterType, setFilterType] = useState<FilterType>('all');
  // フィルタリング
  const filteredTransactions = transactions.filter((transaction) => {
    if (filterType === 'all') return true;
    return transaction.transactionType === filterType;
  });

  // 日付降順でソート
  const sortedTransactions = [...filteredTransactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return (
    <>
      <div>
        <h2>りれき</h2>
        <button onClick={() => setFilterType('all')}>すべて</button>
        <button onClick={() => setFilterType('income')}>もらった</button>
        <button onClick={() => setFilterType('expense')}>つかった</button>
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
