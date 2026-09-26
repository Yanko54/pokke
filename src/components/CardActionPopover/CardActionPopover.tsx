import styles from './CardActionPopover.module.css';

type CardActionPopoverProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export const CardActionPopover = ({ onEdit, onDelete }: CardActionPopoverProps) => {
  return (
    <div className={styles.menu}>
      <button className={styles.menuItem} type="button" onClick={onEdit}>
        編集
      </button>
      <button className={styles.menuItem} type="button" onClick={onDelete}>
        削除
      </button>
    </div>
  );
};
