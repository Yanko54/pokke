import { useState } from 'react';
import { TemplateCard } from '../components/TemplateCard/TemplateCard';
import type { Template } from '../types/template';
import { BottomSheet } from '../components/BottomSheet/BottomSheet';

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
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {incomeTemplates.map((template) => (
        <TemplateCard key={template.id} template={template} onClick={() => setIsOpen(true)} />
      ))}
      <BottomSheet isOpen={isOpen} />
    </>
  );
};
