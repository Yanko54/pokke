import plusIcon from '../../assets/icons/common/plus-white.svg';
import styles from './FloatingActionButton.module.css';

type FloatingActionButtonProps = {
  onClick: () => void;
};

export const FloatingActionButton = ({ onClick }: FloatingActionButtonProps) => {
  return (
    <button className={styles.fab} onClick={onClick}>
      <img className={styles.plus} src={plusIcon} alt="" />
    </button>
  );
};
