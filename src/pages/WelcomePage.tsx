import { useState } from 'react';
import type { CreateChild } from '../types/child';

type WelcomePageProps = {
  onAddChild: (child: CreateChild) => void;
};

export const WelcomePage = ({ onAddChild }: WelcomePageProps) => {
  const [childName, setChildName] = useState('');
  return (
    <div>
      <h1>ポッケへようこそ！</h1>
      <p>
        こどものなまえを
        <br />
        とうろくしてね
      </p>
      <input
        type="text"
        placeholder="なまえ"
        value={childName}
        onChange={(e) => {
          setChildName(e.target.value);
        }}
      />
      <button
        onClick={() => {
          if (!childName.trim()) {
            alert('こどものなまえをいれてね');
            return;
          }
          onAddChild({ name: childName.trim() });
        }}
      >
        とうろく
      </button>
    </div>
  );
};
