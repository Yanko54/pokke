import type { Transaction } from '../../types/transaction';
import { formatDate } from '../../utils/date';

type HistoryCardProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
};

export const HistoryCard = ({ transaction, onDelete }: HistoryCardProps) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '8px', margin: '8px' }}>
      <span>{transaction.icon}</span>
      <span>{transaction.memo}</span>
      <span>
        {transaction.transactionType === 'income'
          ? `+${transaction.amount}円`
          : `-${transaction.amount}円`}
      </span>
      <span>{formatDate(transaction.createdAt)}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`${transaction.memo}を削除しますか？`)) {
            onDelete(transaction.id);
          }
        }}
      >
        ⋮
      </button>
    </div>
  );
};
