import { useState } from 'react';
import { templateIcons } from '../../constants/icons';
import { formatDate } from '../../utils/date';
import kebabIcon from '../../assets/icons/common/kebab.svg';
import type { Transaction } from '../../types/transaction';
import styles from './HistoryCard.module.css';
import { PopoverMenu } from './PopoverMenu';

type HistoryCardProps = {
  transaction: Transaction;
  onEdit: (transaction: Transaction) => void;
  onDelete: (id: string) => boolean;
  showToast: (message: string) => void;
};

export const HistoryCard = ({ transaction, onEdit, onDelete, showToast }: HistoryCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
          type="button"
          aria-label="メニューをひらく"
          onClick={() => setIsMenuOpen((prev) => !prev)}
        >
          <img src={kebabIcon} alt="" />
        </button>
      </div>
      {isMenuOpen && (
        <>
          <div className={styles.menuBackdrop} onClick={() => setIsMenuOpen(false)} />
          <PopoverMenu
            onEdit={() => {
              onEdit(transaction);
              setIsMenuOpen(false);
            }}
            onDelete={() => {
              if (
                !confirm(
                  transaction.memo
                    ? `「${transaction.memo}」を削除しますか？`
                    : 'この記録を削除しますか？',
                )
              ) {
                return;
              }
              const deleted = onDelete(transaction.id);
              if (!deleted) {
                alert('残高不足になるため\nこの履歴は削除できません');
                return;
              }
              setIsMenuOpen(false);
              showToast('削除しました');
            }}
          />
        </>
      )}
    </div>
  );
};
