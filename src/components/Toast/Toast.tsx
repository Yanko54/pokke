import styles from './Toast.module.css';

type ToastProps = {
  message: string;
};

export const Toast = ({ message }: ToastProps) => {
  return (
    <div className={styles.toast}>
      <div className={styles.content}>
        <p>{message}</p>
      </div>
    </div>
  );
};
