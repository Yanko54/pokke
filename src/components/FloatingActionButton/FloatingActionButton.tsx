import styles from './FloatingActionButton.module.css';

type FloatingActionButtonProps = {
  onClick: () => void;
};

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <button className={styles.fab} onClick={onClick}>
      +
    </button>
  );
};
