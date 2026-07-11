import type { Transaction } from '../../types/transaction';
import { templateIcons } from '../../constants/icons';
import { formatDate } from '../../utils/date';
import styles from './HistoryCard.module.css';

type HistoryCardProps = {
  transaction: Transaction;
  onDelete: (id: string) => void;
  showToast: (message: string) => void;
};

export const HistoryCard = ({ transaction, onDelete, showToast }: HistoryCardProps) => {
  const selectedIcon = templateIcons.find((item) => item.id === transaction.icon);
  return (
    <div className={styles.card}>
      <div className={styles.content}>
        <img className={styles.icon} src={selectedIcon?.icon} alt="" />
        <div className={styles.info}>
          <div className={styles.memoArea}>
            <p className={styles.memo}>{transaction.memo}</p>
          </div>
          <p className={styles.createdAt}>{formatDate(transaction.createdAt)}</p>
        </div>
        <p
          className={`${styles.amount} ${
            transaction.transactionType === 'income' ? styles.income : styles.expense
          }`}
        >
          {transaction.transactionType === 'income'
            ? `+${transaction.amount}`
            : `-${transaction.amount}`}
          <span>円</span>
        </p>
        <button
          className={styles.menuButton}
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
    </div>
  );
};
