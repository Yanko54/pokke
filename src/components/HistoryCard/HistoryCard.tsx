import type { Transaction } from '../../types/transaction';
import { formatDate } from '../../utils/date';

type HistoryCardProps = {
  transaction: Transaction;
};

export const HistoryCard = ({ transaction }: HistoryCardProps) => {
  return (
    <div>
      <span>{transaction.icon}</span>
      <span>{transaction.memo}</span>
      <span>
        {transaction.transactionType === 'income'
          ? `+${transaction.amount}円`
          : `-${transaction.amount}円`}
      </span>
      <span>{formatDate(transaction.createdAt)}</span>
    </div>
  );
};
