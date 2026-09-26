import type { Child } from '../../types/child';
import checkIcon from '../../assets/icons/check.svg';
import pencilIcon from '../../assets/icons/pencil.svg';
import styles from './ChildPopover.module.css';

type ChildPopoverProps = {
  children: Child[];
  selectedChildId: string;
  onSelect: (id: string) => void;
  onEdit: (id: string) => void;
  onAdd: () => void;
};

export const ChildPopover = ({
  children,
  selectedChildId,
  onSelect,
  onEdit,
  onAdd,
}: ChildPopoverProps) => (
  <div className={styles.popover} aria-label="子どもを選択">
    <div className={styles.list}>
      {children.map((child) => (
        <div
          className={`${styles.row} ${child.id === selectedChildId ? styles.currentRow : ''}`}
          key={child.id}
        >
          <button
            className={styles.selectButton}
            type="button"
            aria-current={child.id === selectedChildId ? 'true' : undefined}
            onClick={() => onSelect(child.id)}
          >
            <span>{child.name}</span>
            {child.id === selectedChildId && (
              <img className={styles.checkIcon} src={checkIcon} alt="" aria-hidden="true" />
            )}
          </button>
          <button
            className={styles.editButton}
            type="button"
            aria-label={`${child.name}の名前を変更`}
            onClick={() => onEdit(child.id)}
          >
            <img className={styles.pencilIcon} src={pencilIcon} alt="" aria-hidden="true" />
          </button>
        </div>
      ))}
    </div>
    <button className={styles.addButton} type="button" onClick={onAdd}>
      ＋ こどもを追加
    </button>
  </div>
);
