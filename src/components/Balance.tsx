import styles from "./Balance.module.css";

type BalanceProps = {
  amount: number;
};

export const Balance = ({ amount }:BalanceProps) => {
  return <div className={styles.balance}>{amount}円</div>;
};