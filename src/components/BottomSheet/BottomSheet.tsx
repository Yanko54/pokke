import { useEffect, useState } from 'react';
import type { Template } from '../../types/template';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
};

export const BottomSheet = ({ isOpen, onClose, template }: BottomSheetProps) => {
  const [amount, setAmount] = useState('');
  const [memo, setMemo] = useState('');

  // template変更時にstate更新
  useEffect(() => {
    if (!template) return;

    setAmount(String(template.amount));
    setMemo(template.memo ?? '');
  }, [template]);

  // ボタン押下時
  const handleSubmit = () => {
    console.log({
      type: template.type,
      amount: Number(amount),
      memo,
      icon: template.icon,
    });
  };

  if (!isOpen || !template) return null;

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <p>{template.icon}</p>
        <input
          type="text"
          inputMode="numeric"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="いくら？"
        />
        <input
          type="text"
          value={memo}
          onChange={(e) => setMemo(e.target.value)}
          placeholder="なにをした？"
        />
        <button onClick={handleSubmit}>きろくする</button>
      </div>
    </div>
  );
};
