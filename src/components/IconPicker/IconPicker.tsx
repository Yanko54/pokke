type IconPickerProps = {
  selectedIcon: string;
  onSelectIcon: (icon: string) => void;
};

// ======= Icon Data =======
const icons = [
  { id: 'shirt', icon: '👕' },
  { id: 'plate', icon: '🍽️' },
  { id: 'cooking', icon: '🍳' },
  { id: 'bed', icon: '🛏️' },
  { id: 'broom', icon: '🧹' },
  { id: 'purse', icon: '👛' },
  { id: 'book', icon: '📚' },
  { id: 'plant', icon: '🌱' },
  { id: 'toy', icon: '🧸' },
  { id: 'cookie', icon: '🍪' },
  { id: 'heart', icon: '❤️' },
  { id: 'pokke', icon: '⭐️' },
];
// ======= UI =======
export const IconPicker = ({ selectedIcon, onSelectIcon }: IconPickerProps) => {
  return (
    <div>
      {icons.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectIcon(item.icon)}
          className={selectedIcon === item.icon ? 'selected' : ''}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
};
