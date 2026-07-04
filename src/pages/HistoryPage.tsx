import type { Transaction } from '../types/transaction';
import { HistoryCard } from '../components/HistoryCard/HistoryCard';

type HistoryPageProps = {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  showToast: (message: string) => void;
};

export const HistoryPage = ({ transactions, onDeleteTransaction, showToast }: HistoryPageProps) => {
  // createdAtが新しい順に並び替え
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return (
    <>
      <div>
        <h2>りれき</h2>
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
