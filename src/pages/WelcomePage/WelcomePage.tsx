import { useState } from 'react';
import type { CreateChild } from '../../types/child';
import logo from '../../assets/Pokke-logo.png';
import styles from './WelcomePage.module.css';

type WelcomePageProps = {
  onAddChild: (child: CreateChild) => void;
};

export const WelcomePage = ({ onAddChild }: WelcomePageProps) => {
  const [childName, setChildName] = useState('');
  return (
    <div className={styles.content}>
      <img className={styles.logo} src={logo} alt="" />
      <h1>ポッケへようこそ！</h1>
      <p>
        こどものなまえを
        <br />
        とうろくしてね
      </p>
      <input
        className={styles.input}
        type="text"
        placeholder="なまえ"
        value={childName}
        maxLength={10}
        autoFocus
        onChange={(e) => setChildName(e.target.value)}
      />
      <button
        className={styles.button}
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
