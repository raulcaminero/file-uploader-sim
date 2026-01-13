import { useRouter } from 'next/router';
import styles from '../styles/Layout.module.css';

export default function Layout({ children }) {
  const router = useRouter();

  const handleExitCase = async () => {
    try {
      await fetch('/api/logout', { method: 'POST', credentials: 'include' });
      router.push('/login');
    } catch (error) {
      console.error('Error closing session:', error);
      router.push('/login');
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>H</span>
          <span className={styles.logoText}>Hearsay</span>
        </div>
        <div className={styles.headerTitle}>Case Details</div>
        <button className={styles.exitButton} onClick={handleExitCase}>
          Exit Case
        </button>
      </header>

      <main className={styles.main}>
        {children}
      </main>

      <footer className={styles.footer}>
        <div className={styles.copyright}>© 2023 Hearsay</div>
        <div className={styles.privacy}>Privacy Policy</div>
      </footer>
    </div>
  );
}
