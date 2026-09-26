import { useEffect, useId, useRef, useState } from 'react';
import type { Child } from '../../types/child';
import { ChildPopover } from '../ChildPopover/ChildPopover';
import chevronDownIcon from '../../assets/icons/chevron-down.svg';
import styles from './Header.module.css';

type HeaderProps = {
  children: Child[];
  selectedChildId: string;
  onSelectChild: (id: string) => void;
  onAddChild: () => void;
  onEditChild: (id: string) => void;
};

export const Header = ({
  children,
  selectedChildId,
  onSelectChild,
  onAddChild,
  onEditChild,
}: HeaderProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverId = useId();
  const selectedChild = children.find((child) => child.id === selectedChildId);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const closeAndRun = (action: () => void) => {
    triggerRef.current?.focus();
    setIsOpen(false);
    action();
  };

  return (
    <header className={styles.header}>
      <button
        ref={triggerRef}
        className={styles.trigger}
        type="button"
        aria-label={`${selectedChild?.name ?? '子ども'}、子どもを切り替える`}
        aria-expanded={isOpen}
        aria-controls={isOpen ? popoverId : undefined}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span>{selectedChild?.name}</span>
        <img
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          src={chevronDownIcon}
          alt=""
          aria-hidden="true"
        />
      </button>
      {isOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => {
              setIsOpen(false);
              triggerRef.current?.focus();
            }}
          />
          <div id={popoverId}>
            <ChildPopover
              children={children}
              selectedChildId={selectedChildId}
              onSelect={(id) => closeAndRun(() => onSelectChild(id))}
              onEdit={(id) => closeAndRun(() => onEditChild(id))}
              onAdd={() => closeAndRun(onAddChild)}
            />
          </div>
        </>
      )}
    </header>
  );
};
