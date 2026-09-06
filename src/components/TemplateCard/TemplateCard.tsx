import { useState } from 'react';
import { templateIcons } from '../../constants/icons';
import { PopoverMenu } from '../PopoverMenu/PopoverMenu';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import kebabIcon from '../../assets/icons/common/kebab.svg';
import dragHandleIcon from '../../assets/icons/common/drag-handle.svg';
import type { Template } from '../../types/template';
import styles from './TemplateCard.module.css';

type TemplateCardProps = {
  template: Template;
  isReordering: boolean;
  onClick: () => void;
  onEdit: (template: Template) => void;
  onDelete: (id: string) => void;
  showToast: (message: string) => void;
};

export const TemplateCard = ({
  template,
  isReordering,
  onClick,
  onEdit,
  onDelete,
  showToast,
}: TemplateCardProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
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
        aria-label={isReordering ? 'テンプレートを並び替える' : 'メニューをひらく'}
        className={styles.menuButton}
        onClick={(e) => {
          e.stopPropagation();
          if (isReordering) return;
          setIsMenuOpen((prev) => !prev);
        }}
        {...(isReordering ? attributes : {})}
        {...(isReordering ? listeners : {})}
      >
        <img src={isReordering ? dragHandleIcon : kebabIcon} alt="" />
      </button>
      {isMenuOpen && !isReordering && (
        <div onClick={(e) => e.stopPropagation()}>
          <div className={styles.menuBackdrop} onClick={() => setIsMenuOpen(false)} />
          <PopoverMenu
            onEdit={() => {
              setIsMenuOpen(false);
              onEdit(template);
            }}
            onDelete={() => {
              if (
                !confirm(
                  template.memo
                    ? `「${template.memo}」を削除しますか？`
                    : 'このテンプレートを削除しますか？',
                )
              ) {
                return;
              }
              onDelete(template.id);
              setIsMenuOpen(false);
              showToast('テンプレートを削除しました');
            }}
          />
        </div>
      )}
    </div>
  );
};
