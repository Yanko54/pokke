import type { Template } from '../../types/template';

type TemplateCardProps = {
  template: Template;
};

export const TemplateCard = ({ template }: TemplateCardProps) => {
  return (
    <button>
      <span>{template.icon}</span>
      <span>{template.memo}</span>
      <span>{template.amount}円</span>
    </button>
  );
};
