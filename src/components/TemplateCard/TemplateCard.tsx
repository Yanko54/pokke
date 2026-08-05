import { templateIcons } from '../../constants/icons';
import kebabIcon from '../../assets/icons/common/kebab.svg';
import dragHandleIcon from '../../assets/icons/common/drag-handle.svg';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
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
  // dnd-kit
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: template.id,
  });
  const selectedIcon = templateIcons.find((item) => item.id === template.icon);
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
      className={`${styles.card} 
        ${isReordering ? styles.reordering : ''}
        ${isDragging ? styles.dragging : ''}`}
      onClick={onClick}
      {...(isReordering ? attributes : {})}
      {...(isReordering ? listeners : {})}
    >
      <div className={styles.content}>
        <img className={styles.icon} src={selectedIcon?.icon} alt="" />
        <div className={styles.memoWrapper}>
          <p className={styles.memo}>{template.memo}</p>
        </div>
        <p
          className={`${styles.amount} ${
            template.transactionType === 'income' ? styles.income : styles.expense
          }`}
        >
          {template.amount}
          <span>円</span>
        </p>
      </div>
      <button
        type="button"
        className={styles.menuButton}
        onClick={(e) => {
          e.stopPropagation();
          if (isReordering) return;
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
        <img src={isReordering ? dragHandleIcon : kebabIcon} alt="" />
      </button>
    </div>
  );
};
