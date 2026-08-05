import plusIcon from '../../assets/icons/common/plus-navy.svg';
import styles from './CreateTemplateCard.module.css';

type CreateTemplateCardProps = {
  onClick: () => void;
};

export const CreateTemplateCard = ({ onClick }: CreateTemplateCardProps) => {
  return (
    <button type="button" className={styles.card} onClick={onClick}>
      <img className={styles.plus} src={plusIcon} alt="" />
      <p className={styles.label}>
        テンプレートを
        <br />
        つくる
      </p>
    </button>
  );
};
