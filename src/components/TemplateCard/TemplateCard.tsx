import { templateIcons } from '../../constants/icons';
import kebabIcon from '../../assets/icons/common/kebab.svg';
import dragHandleIcon from '../../assets/icons/common/drag-handle.svg';
import type { Template } from '../../types/template';
import styles from './TemplateCard.module.css';

type TemplateCardProps = {
  template: Template;
  isReordering: boolean;
  onClick: () => void;
  onDelete: (id: string) => void;
  showToast: (message: string) => void;
};

export const TemplateCard = ({
  template,
  isReordering,
  onClick,
  onDelete,
  showToast,
}: TemplateCardProps) => {
  const selectedIcon = templateIcons.find((item) => item.id === template.icon);
  return (
    <div className={`${styles.card} ${isReordering ? styles.reordering : ''}`} onClick={onClick}>
      <div className={styles.content}>
        <img className={styles.icon} src={selectedIcon?.icon} alt="" />
        <div className={styles.memoWrapper}>
          <p className={styles.memo}>{template.memo}</p>
        </div>{' '}
        <p
          className={`${styles.amount} ${
            template.transactionType === 'income' ? styles.income : styles.expense
          }`}
        >
          {' '}
          {template.amount}
          <span>円</span>
        </p>
      </div>
      <button
        className={styles.menuButton}
        onClick={(e) => {
          e.stopPropagation();
          if (
            confirm(
              template.memo
                ? `「${template.memo}」を削除しますか？`
                : 'このテンプレートを削除しますか？',
            )
          ) {
            onDelete(template.id);
            showToast('テンプレートを削除しました');
          }
        }}
      >
        <img src={isReordering ? dragHandleIcon : kebabIcon} alt="" />{' '}
      </button>
    </div>
  );
};
