import { useId } from 'react';
import { BottomSheet } from '../BottomSheet/BottomSheet';
import { ChildForm } from '../ChildForm/ChildForm';
import sheetStyles from '../BottomSheet/BottomSheetForm.module.css';
import styles from './ChildSheet.module.css';

type ChildSheetProps = {
  isOpen: boolean;
  mode: 'add' | 'edit';
  initialName?: string;
  validateName: (name: string) => string | null;
  onSubmit: (name: string) => string | null;
  onClose: () => void;
};

export const ChildSheet = ({
  isOpen,
  mode,
  initialName = '',
  validateName,
  onSubmit,
  onClose,
}: ChildSheetProps) => {
  const titleId = useId();

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} ariaLabelledBy={titleId}>
      <div className={`${sheetStyles.content} ${styles.content}`}>
        <h2 id={titleId}>{mode === 'add' ? 'こどもを追加' : 'なまえを変更'}</h2>
        <ChildForm
          mode={mode === 'add' ? 'create' : 'edit'}
          appearance="sheet"
          initialName={initialName}
          submitLabel={mode === 'add' ? 'とうろく' : 'へんこうする'}
          validateName={validateName}
          onSubmit={onSubmit}
        />
      </div>
    </BottomSheet>
  );
};
