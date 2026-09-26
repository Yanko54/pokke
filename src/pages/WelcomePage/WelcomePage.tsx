import { ChildForm } from '../../components/ChildForm/ChildForm';
import logo from '../../assets/Pokke-logo.png';
import styles from './WelcomePage.module.css';

type WelcomePageProps = {
  onAddChild: (name: string) => string | null;
  validateName: (name: string) => string | null;
};

export const WelcomePage = ({ onAddChild, validateName }: WelcomePageProps) => {
  return (
    <div className={styles.content}>
      <img className={styles.logo} src={logo} alt="" />
      <h1>ポッケへようこそ！</h1>
      <p>
        こどものなまえを
        <br />
        とうろくしてね
      </p>
      <ChildForm mode="create" submitLabel="とうろく" validateName={validateName} onSubmit={onAddChild} />
    </div>
  );
};
