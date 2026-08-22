type PopoverMenuProps = {
  onEdit: () => void;
  onDelete: () => void;
};

export const PopoverMenu = ({ onEdit, onDelete }: PopoverMenuProps) => {
  return (
    <div>
      <button type="button" onClick={onEdit}>
        編集
      </button>
      <button type="button" onClick={onDelete}>
        削除
      </button>
    </div>
  );
};
