import { useEffect, useState } from 'react';
import type { Template, CreateTemplate } from '../../types/template';
import type { TransactionType, CreateTransaction } from '../../types/transaction';
import { SegmentedControl } from '../SegmentedControl/SegmentedControl';
import { BottomSheet } from './BottomSheet';
import { IconPicker } from '../IconPicker/IconPicker';
import { templateIcons } from '../../constants/icons';
import styles from './FormBottomSheet.module.css';

type FormState = {
  transactionType: TransactionType;
  icon: string;
  amount: string;
  memo: string;
};

// ======= Props =======
type FormBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  transactionType: TransactionType;
  onAddTransaction: (transaction: CreateTransaction) => void;
  onAddTemplate: (template: CreateTemplate) => void;
  showToast: (message: string) => void;
  balance: number;
};

export const FormBottomSheet = ({
  isOpen,
  onClose,
  transactionType,
  template,
  onAddTransaction,
  onAddTemplate,
  showToast,
  balance,
}: FormBottomSheetProps) => {
  // ======= State =======
  const [form, setForm] = useState<FormState>({
    transactionType,
    icon: '',
    amount: '',
    memo: '',
  });
  const [mode, setMode] = useState<'form' | 'icon'>('form');
  const [errorMessage, setErrorMessage] = useState('');

  // ======= 初期値設定 =======
  useEffect(() => {
    if (!isOpen) return;
    setErrorMessage('');
    setMode('form');
    // template変更時にフォームの初期値を更新
    if (template) {
      setForm({
        transactionType: template.transactionType,
        icon: template.icon,
        amount: String(template.amount), // inputは文字列で扱うためnumber → stringへ変換
        memo: template.memo ?? '', // nullなら空文字を設定
      });
    } else {
      // 新規登録時は空フォームを設定
      setForm({
        transactionType,
        icon: 'pokke', // デフォルトアイコン
        amount: '',
        memo: '',
      });
    }
  }, [isOpen, template, transactionType]);

  // ======= 取引登録 =======
  const handleSubmit = () => {
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
    showToast('きろくしました');
    onClose();
  };

  // ======= テンプレート保存 =======
  const handleAddTemplate = () => {
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
    showToast('テンプレートをつくりました');
    onClose();
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
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <div className={styles.content}>
        {mode === 'form' ? (
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
                maxLength={20}
                value={form.memo}
                placeholder={form.transactionType === 'income' ? 'おてつだい' : 'ガチャガチャ'}
                onChange={(e) => setForm({ ...form, memo: e.target.value })}
              />
            </div>
            <div className={styles.buttonArea}>
              <button className={styles.iconButton} type="button" onClick={() => setMode('icon')}>
                アイコンをえらぶ
                {selectedIcon && <img src={selectedIcon.icon} alt="" />}
              </button>
              <p className={styles.errorMessage}>{errorMessage}</p>
              <div className={styles.actionbuttons}>
                <button
                  className={styles.mainButton}
                  type="button"
                  disabled={isAmountEmpty}
                  onClick={handleSubmit}
                >
                  きろくする
                </button>
                <button
                  className={styles.subButton}
                  type="button"
                  disabled={isAmountEmpty}
                  onClick={handleAddTemplate}
                >
                  テンプレートとして保存
                </button>
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
                setMode('form');
              }}
            />
            <button className={styles.subButton} onClick={() => setMode('form')}>
              もどる
            </button>
          </>
        )}
      </div>
    </BottomSheet>
  );
};
