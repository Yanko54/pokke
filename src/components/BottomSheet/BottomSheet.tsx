import { useEffect, useState } from 'react';
import type { Template } from '../../types/template';
import type { Transaction, TransactionType } from '../../types/transaction';

type FormState = {
  type: TransactionType;
  icon: string;
  amount: string;
  memo: string;
};

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
  type: TransactionType;
};

export const BottomSheet = ({ isOpen, onClose, template, type }: BottomSheetProps) => {
  const [form, setForm] = useState<FormState>({
    type,
    icon: '',
    amount: '',
    memo: '',
  });

  useEffect(() => {
    // template変更時にフォームの初期値を更新
    if (template) {
      setForm({
        type: template.type,
        icon: template.icon,
        amount: String(template.amount), // inputは文字列で扱うためnumber → stringへ変換
        memo: template.memo ?? '', // nullなら空文字を設定
      });
    } else {
      // 新規登録時は空フォームを設定
      setForm({
        type,
        icon: '',
        amount: '',
        memo: '',
      });
    }
  }, [template, type]);

  const handleSubmit = () => {
    const transaction: Transaction = {
      id: crypto.randomUUID(),
      templateId: template ? template.id : null,
      type: form.type,
      icon: form.icon,
      amount: Number(form.amount),
      memo: form.memo || null,
      createdAt: new Date().toISOString(),
    };

    console.log(transaction);
  };

  if (!isOpen) return null;

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
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
      </div>
    </div>
  );
};
