import type { Template } from '../../types/template';

type BottomSheetProps = {
  isOpen: boolean;
  onClose: () => void;
  template: Template | null;
};

export const BottomSheet = ({ isOpen, onClose, template }: BottomSheetProps) => {
  if (!isOpen || !template) return null;

  return (
    <div onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()}>
        <p>{template.icon}</p>
        <p>{template.memo}</p>
        <p>{template.amount}円</p>
      </div>
    </div>
  );
};
