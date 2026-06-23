import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template } from '../types/template';

const incomeTemplates: Template[] = [
  {
    id: '1',
    type: 'income',
    icon: '👕',
    memo: 'せんたくをたたむ',
    amount: 20,
    order: 1,
  },
  {
    id: '2',
    type: 'income',
    icon: '🌱',
    memo: 'みずやり',
    amount: 10,
    order: 2,
  },
];

export const IncomePage = () => {
  return (
    <main>
      {incomeTemplates.map((template) => (
        <TemplateCard key={template.id} template={template} />
      ))}
    </main>
  );
};
