type ToastProps = {
  message: string;
};

export const Toast = ({ message }: ToastProps) => {
  return (
    <div>
      <p>{message}</p>
    </div>
  );
};
