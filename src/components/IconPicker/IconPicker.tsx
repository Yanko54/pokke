import { templateIcons } from '../../constants/icons';
import styles from './IconPicker.module.css';

type IconPickerProps = {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
};

// ======= UI =======
export const IconPicker = ({ selectedIcon, onSelectIcon }: IconPickerProps) => {
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <h2>アイコンをえらぶ</h2>
      </div>
      <div className={styles.grid}>
        {templateIcons.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelectIcon(item.id)}
            className={`${styles.iconButton} ${selectedIcon === item.id ? styles.selected : ''}`}
          >
            <img src={item.icon} alt="" />
          </button>
        ))}
      </div>
    </div>
  );
};
