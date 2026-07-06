import type { Transaction } from '../../types/transaction';
import { templateIcons } from '../../constants/icons';
import { formatDate } from '../../utils/date';

type HistoryCardProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
  showToast: (message: string) => void;
};

export const HistoryCard = ({ transaction, onDelete, showToast }: HistoryCardProps) => {
  const selectedIcon = templateIcons.find((item) => item.id === transaction.icon);
  return (
    <div style={{ border: '1px solid #ccc', padding: '8px', margin: '8px' }}>
      <img src={selectedIcon?.icon} alt="" />
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
          if (confirm(`「${transaction.memo}」を削除しますか？`)) {
            onDelete(transaction.id);
            showToast('削除しました');
          }
        }}
      >
        ⋮
      </button>
    </div>
  );
};
