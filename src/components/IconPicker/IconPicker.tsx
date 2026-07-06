import { templateIcons } from '../../constants/icons';

type IconPickerProps = {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
};

// ======= UI =======
export const IconPicker = ({ selectedIcon, onSelectIcon }: IconPickerProps) => {
  return (
    <div>
      <h2>アイコンをえらぶ</h2>
      {templateIcons.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectIcon(item.id)}
          className={selectedIcon === item.id ? 'selected' : ''}
        >
          <img src={item.icon} alt="" />
        </button>
      ))}
    </div>
  );
};
