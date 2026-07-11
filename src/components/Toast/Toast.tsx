import styles from './Toast.module.css';

type ToastProps = {
  message: string;
};

export const Toast = ({ message }: ToastProps) => {
  return (
    <div className={styles.toast}>
      <p>{message}</p>
    </div>
  );
};
