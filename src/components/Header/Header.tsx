import styles from "./Header.module.css";

type HeaderProps = {
  childName: string;
};

export const Header = ({ childName }: HeaderProps) =>{
  return <header className={styles.header}>{childName}</header>;
};