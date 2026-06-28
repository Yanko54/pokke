import type { Transaction } from '../types/transaction';
import { HistoryCard } from '../components/HistoryCard/HistoryCard';

type HistoryPageProps = {
  transactions: Transaction[];
};

export const HistoryPage = ({ transactions }: HistoryPageProps) => {
  return (
    <>
      {transactions.map((transaction) => (
        <HistoryCard key={transaction.id} transaction={transaction} />
      ))}
    </>
  );
};
