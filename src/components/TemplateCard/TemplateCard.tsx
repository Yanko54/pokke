import type { Template } from '../../types/template';

type TemplateCardProps = {
  template: Template;
  onClick: () => void;
  onDelete: (id: string) => void;
  showToast: (message: string) => void;
};

export const TemplateCard = ({ template, onClick, onDelete, showToast }: TemplateCardProps) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '8px', margin: '8px' }} onClick={onClick}>
      <span>{template.icon}</span>
      <span>{template.memo}</span>
      <span>{template.amount}円</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          if (confirm(`${template.memo}を削除しますか？`)) {
            onDelete(template.id);
            showToast('テンプレートを削除しました');
          }
        }}
      >
        ⋮
      </button>
    </div>
  );
};
