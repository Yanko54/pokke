import styles from './SegmentedControl.module.css';

type SegmentedControlProps<T extends string> = {
  options: {
    value: T;
    label: string;
  }[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
};

export const SegmentedControl = <T extends string>({
  options,
  value,
  onChange,
  size = 'md',
}: SegmentedControlProps<T>) => {
  return (
    <div className={`${styles.segmentedControl} ${styles[size]}`}>
      <div className={styles.content}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`${styles.button} ${value === option.value ? styles.active : ''}`}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
};
