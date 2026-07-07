import styles from './Balance.module.css';
import coin from '../../assets/icons/coin.png';

type BalanceProps = {
  amount: number;
};

export const Balance = ({ amount }: BalanceProps) => {
  return (
    <div className={styles.balance}>
      <div className={styles.content}>
        <p className={styles.label}>おさいふ</p>
        <img className={styles.icon} src={coin} alt="コイン" />
        <p className={styles.amount}>
          {amount.toLocaleString()}
          <span>円</span>
        </p>
      </div>
    </div>
  );
};
