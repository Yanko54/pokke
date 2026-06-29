import { useEffect, useState } from 'react';
import type { Template } from '../../types/template';
import type { Transaction, TransactionType } from '../../types/transaction';
import { BottomSheet } from './BottomSheet';

type FormState = {
  transactionType: TransactionType;
  icon: string;
  amount: string;
  memo: string;
};

type FormBottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  transactionType: TransactionType;
  onAddTransaction: (transaction: Transaction) => void;
  balance: number;
};

export const FormBottomSheet = ({
  isOpen,
  onClose,
  template,
  transactionType,
  onAddTransaction,
  balance,
}: FormBottomSheetProps) => {
  const [form, setForm] = useState<FormState>({
    transactionType,
    icon: '',
    amount: '',
    memo: '',
  });

  useEffect(() => {
    if (!isOpen) return;
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
        icon: '',
        amount: '',
        memo: '',
      });
    }
  }, [isOpen, template, transactionType]);

  const handleSubmit = () => {
    const amount = Number(form.amount);
    // 金額未入力・0円・マイナス金額の登録は許可しない
    if (isNaN(amount) || amount <= 0) {
      alert('おかねをただしく入力してください');
      return;
    }
    // 残高不足チェック
    if (transactionType === 'expense' && amount > balance) {
      alert('おかねがたりません');
      return;
    }

    const transaction: Transaction = {
      id: crypto.randomUUID(),
      templateId: template ? template.id : null,
      transactionType: form.transactionType,
      icon: form.icon,
      amount: amount,
      memo: form.memo || null,
      createdAt: new Date().toISOString(),
    };

    onAddTransaction(transaction);
    alert('きろくしました');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      <p>{form.icon}</p>
      <input
        type="text"
        inputMode="numeric"
        value={form.amount}
        onChange={(e) =>
          setForm({
            ...form,
            amount: e.target.value,
          })
        }
        placeholder="いくら？"
      />

      <input
        type="text"
        value={form.memo}
        onChange={(e) =>
          setForm({
            ...form,
            memo: e.target.value,
          })
        }
        placeholder="なにをした？"
      />
      <button onClick={handleSubmit}>きろくする</button>
    </BottomSheet>
  );
};
