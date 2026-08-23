import styles from './PopoverMenu.module.css';

type PopoverMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export const PopoverMenu = ({ onEdit, onDelete }: PopoverMenuProps) => {
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
