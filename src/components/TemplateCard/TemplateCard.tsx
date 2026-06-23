import type { Template } from '../../types/template';

type TemplateCardProps = {
  template: Template;
  onClick: () => void;
};

export const TemplateCard = ({ template, onClick }: TemplateCardProps) => {
  return (
    <button onClick={onClick}>
      <span>{template.icon}</span>
      <span>{template.memo}</span>
      <span>{template.amount}円</span>
    </button>
  );
};
