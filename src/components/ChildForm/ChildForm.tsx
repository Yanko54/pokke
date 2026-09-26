import { useId, useState } from 'react';
import sheetStyles from '../BottomSheet/BottomSheetForm.module.css';
import styles from './ChildForm.module.css';

type ChildFormProps = {
  initialName?: string;
  submitLabel: string;
  mode: 'create' | 'edit';
  appearance?: 'welcome' | 'sheet';
  validateName: (name: string) => string | null;
  onSubmit: (name: string) => string | null;
};

export const ChildForm = ({
  initialName = '',
  submitLabel,
  mode,
  appearance = 'welcome',
  validateName,
  onSubmit,
}: ChildFormProps) => {
  const inputId = useId();
  const errorId = useId();
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');
  const trimmedName = name.trim();
  const isUnchanged = mode === 'edit' && trimmedName === initialName.trim();

  const handleSubmit = (event: React.SubmitEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!trimmedName || isUnchanged) return;

    const validationError = validateName(trimmedName);
    if (validationError) {
      setError(validationError);
      return;
    }

    const submitError = onSubmit(trimmedName);
    if (submitError) setError(submitError);
  };

  return (
    <form
      className={`${styles.form} ${appearance === 'welcome' ? styles.welcome : styles.sheet}`}
      onSubmit={handleSubmit}
    >
      <label className={styles.label} htmlFor={inputId}>こどものなまえ</label>
      <div className={`${styles.inputGroup} ${appearance === 'sheet' ? styles.sheetInputGroup : ''}`}>
        <input
          id={inputId}
          className={`${styles.input} ${appearance === 'sheet' ? styles.sheetInput : ''}`}
          type="text"
          placeholder="なまえ"
          value={name}
          maxLength={10}
          autoFocus
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          onChange={(event) => {
            setName(event.target.value);
            setError('');
          }}
        />
        {error && <p id={errorId} className={styles.error} role="alert">{error}</p>}
      </div>
      <button
        className={appearance === 'sheet' ? sheetStyles.submitButton : styles.button}
        type="submit"
        disabled={!trimmedName || isUnchanged}
      >
        {submitLabel}
      </button>
    </form>
  );
};
