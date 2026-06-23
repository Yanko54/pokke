type BottomSheetProps = {
  isOpen: boolean;
};

export const BottomSheet = ({ isOpen }: BottomSheetProps) => {
  if (!isOpen) return null;
  return <div>ボトムシート</div>;
};
