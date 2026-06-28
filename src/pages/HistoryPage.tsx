import type { Transaction } from '../types/transaction';
import { HistoryCard } from '../components/HistoryCard/HistoryCard';

type HistoryPageProps = {
  transactions: Transaction[];
};

export const HistoryPage = ({ transactions }: HistoryPageProps) => {
  // createdAtが新しい順に並び替え
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  return (
    <>
      {sortedTransactions.map((transaction) => (
        <HistoryCard key={transaction.id} transaction={transaction} />
      ))}
    </>
  );
};
