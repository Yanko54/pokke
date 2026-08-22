import { useState } from 'react';
import type { Template, CreateTemplate } from '../../types/template';
import type {
  Transaction,
  TransactionType,
  CreateTransaction,
  UpdateTransaction,
  UpdateTransactionResult,
} from '../../types/transaction';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { IconPicker } from './IconPicker';
import { templateIcons } from '../../constants/icons';
import styles from './FormContent.module.css';

type FormState = {
  transactionType: TransactionType;
  icon: string;
  amount: string;
  memo: string;
};

export type FormMode = 'createTransaction' | 'createTemplate' | 'editTransaction';

// ======= Props =======
type BaseFormContentProps = {
  onClose: () => void;
  showToast: (message: string) => void;
};

type FormContentProps =
  | (BaseFormContentProps & {
      mode: 'createTransaction';
      template: Template | null;
      transactionType: TransactionType;
      onAddTransaction: (transaction: CreateTransaction) => void;
      balance: number;
    })
  | (BaseFormContentProps & {
      mode: 'createTemplate';
      transactionType: TransactionType;
      onAddTemplate: (template: CreateTemplate) => void;
    })
  | (BaseFormContentProps & {
      mode: 'editTransaction';
      transaction: Transaction;
      onUpdateTransaction: (id: string, transaction: UpdateTransaction) => UpdateTransactionResult;
    });

export const FormContent = (props: FormContentProps) => {
  // ======= State =======
  const [form, setForm] = useState<FormState>(() => {
    if (props.mode === 'editTransaction') {
      const { transaction } = props;
      return {
        transactionType: transaction.transactionType,
        icon: transaction.icon,
        amount: String(transaction.amount),
        memo: transaction.memo ?? '',
      };
    }

    if (props.mode === 'createTransaction' && props.template) {
      const { template } = props;
      return {
        transactionType: template.transactionType,
        icon: template.icon,
        amount: String(template.amount),
        memo: template.memo ?? '',
      };
    }

    return {
      transactionType: props.transactionType,
      icon: 'pokke',
      amount: '',
      memo: '',
    };
  });
  const [viewMode, setViewMode] = useState<'form' | 'icon'>('form');
  const [errorMessage, setErrorMessage] = useState('');

  // ======= 取引登録 =======
  const handleSubmit = () => {
    if (props.mode !== 'createTransaction') return;
    const { template, onAddTransaction, balance } = props;

    const amount = Number(form.amount);
    // 未入力・0円・マイナス・小数点以下の金額の登録は許可しない
    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      setErrorMessage('おかねをただしく入力してください');
      return;
    }
    // 残高不足チェック
    if (form.transactionType === 'expense' && amount > balance) {
      setErrorMessage('おかねがたりません');
      return;
    }

    const transaction: CreateTransaction = {
      templateId: template ? template.id : null,
      transactionType: form.transactionType,
      icon: form.icon,
      amount: amount,
      memo: form.memo || null,
    };

    setErrorMessage('');
    onAddTransaction(transaction);
    props.showToast('きろくしました');
    props.onClose();
  };

  // ======= 取引編集 =======
  const handleEditTransaction = () => {
    if (props.mode !== 'editTransaction') return;
    const { transaction, onUpdateTransaction } = props;

    const amount = Number(form.amount);
    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      setErrorMessage('おかねをただしく入力してください');
      return;
    }

    const updateTransaction: UpdateTransaction = {
      transactionType: form.transactionType,
      icon: form.icon,
      amount: amount,
      memo: form.memo || null,
    };

    const result = onUpdateTransaction(transaction.id, updateTransaction);
    if (result === 'notEnoughBalance') {
      setErrorMessage('おかねがたりなくなります');
      return;
    }

    if (result === 'notFound') {
      setErrorMessage('きろくがみつかりません');
      return;
    }

    setErrorMessage('');
    props.showToast('へんこうしました');
    props.onClose();
  };

  // ======= テンプレート保存 =======
  const handleAddTemplate = () => {
    if (props.mode !== 'createTemplate') return;
    const { onAddTemplate } = props;

    const amount = Number(form.amount);
    if (isNaN(amount) || amount <= 0 || !Number.isInteger(amount)) {
      setErrorMessage('おかねをただしく入力してください');
      return;
    }

    const newTemplate: CreateTemplate = {
      transactionType: form.transactionType,
      icon: form.icon,
      amount: amount,
      memo: form.memo || null,
    };

    onAddTemplate(newTemplate);
    props.showToast('テンプレートをつくりました');
    props.onClose();
  };

  const selectedIcon = templateIcons.find((item) => item.id === form.icon);

  const isAmountEmpty = form.amount.trim() === '';

  const transactionTypeOptions: {
    value: TransactionType;
    label: string;
  }[] = [
    { value: 'income', label: 'もらう' },
    { value: 'expense', label: 'つかう' },
  ];

  // ======= UI =======
  return (
    <div className={styles.content}>
      {viewMode === 'form' ? (
        // ---- フォーム画面 ----
        <>
          <SegmentedControl<TransactionType>
            options={transactionTypeOptions}
            value={form.transactionType}
            onChange={(transactionType) => setForm({ ...form, transactionType })}
            size="md"
          />
          <div className={styles.inputField}>
            <label className={styles.label} htmlFor="amount">
              いくら？
            </label>
            <div className={styles.amountInput}>
              <input
                id="amount"
                className={styles.input}
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={form.amount}
                placeholder="100"
                onChange={(e) => {
                  setForm({ ...form, amount: e.target.value });
                  setErrorMessage('');
                }}
              />
              <span className={styles.unit}>円</span>
            </div>
          </div>
          <div className={styles.inputField}>
            <label className={styles.label} htmlFor="memo">
              なにをした？
            </label>
            <textarea
              id="memo"
              className={styles.input}
              maxLength={24}
              value={form.memo}
              placeholder={form.transactionType === 'income' ? 'おてつだい' : 'ガチャガチャ'}
              onChange={(e) => setForm({ ...form, memo: e.target.value })}
            />
          </div>
          <div className={styles.buttonArea}>
            <button className={styles.iconButton} type="button" onClick={() => setViewMode('icon')}>
              アイコンをえらぶ
              {selectedIcon && <img src={selectedIcon.icon} alt="" />}
            </button>
            <p className={styles.errorMessage}>{errorMessage}</p>
            <div className={styles.actionbuttons}>
              {props.mode === 'createTransaction' ? (
                <button
                  className={styles.mainButton}
                  type="button"
                  disabled={isAmountEmpty}
                  onClick={handleSubmit}
                >
                  きろくする
                </button>
              ) : props.mode === 'createTemplate' ? (
                <button
                  className={styles.mainButton}
                  type="button"
                  disabled={isAmountEmpty}
                  onClick={handleAddTemplate}
                >
                  つくる
                </button>
              ) : (
                <button
                  className={styles.mainButton}
                  type="button"
                  disabled={isAmountEmpty}
                  onClick={handleEditTransaction}
                >
                  へんこうする
                </button>
              )}
            </div>
          </div>
        </>
      ) : (
        // ---- アイコン選択画面 ----
        <>
          <IconPicker
            selectedIcon={form.icon}
            onSelectIcon={(icon) => {
              setForm({ ...form, icon });
              setViewMode('form');
            }}
          />
          <button className={styles.subButton} onClick={() => setViewMode('form')}>
            もどる
          </button>
        </>
      )}
    </div>
  );
};
