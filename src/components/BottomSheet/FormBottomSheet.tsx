import { useEffect, useState } from 'react';
import type { Template, CreateTemplate } from '../../types/template';
import type { TransactionType, CreateTransaction } from '../../types/transaction';
import { BottomSheet } from './BottomSheet';
import { IconPicker } from '../IconPicker/IconPicker';

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
  balance: number;
};

export const FormBottomSheet = ({
  isOpen,
  onClose,
  template,
  transactionType,
  onAddTransaction,
  onAddTemplate,
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

  // ======= 初期値設定 =======
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
        icon: '⭐️', // デフォルトアイコンを設定
        amount: '',
        memo: '',
      });
    }
  }, [isOpen, template, transactionType]);

  // ======= 取引登録 =======
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

    const transaction: CreateTransaction = {
      templateId: template ? template.id : null,
      transactionType: form.transactionType,
      icon: form.icon,
      amount: amount,
      memo: form.memo || null,
    };

    onAddTransaction(transaction);
    alert('きろくしました');
    onClose();
  };

  // ======= テンプレート保存 =======
  const handleAddTemplate = () => {
    const amount = Number(form.amount);

    if (!form.icon) {
      alert('アイコンがないよ');
      return;
    }
    if (isNaN(amount) || amount <= 0) {
      alert('いくらかおしえてね');
      return;
    }

    const newTemplate: CreateTemplate = {
      transactionType: form.transactionType,
      icon: form.icon,
      amount: amount,
      memo: form.memo || null,
    };

    onAddTemplate(newTemplate);
    alert('テンプレートをつくりました');
    onClose();
  };

  // ======= UI =======
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose}>
      {mode === 'form' ? (
        // ---- フォーム画面 ----
        <>
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
          <button onClick={() => setMode('icon')}>{form.icon}アイコンをえらぶ</button>
          <button onClick={handleSubmit}>きろくする</button>
          <button onClick={handleAddTemplate}>テンプレートとして保存</button>
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
          <button onClick={() => setMode('form')}>もどる</button>
        </>
      )}
    </BottomSheet>
  );
};
