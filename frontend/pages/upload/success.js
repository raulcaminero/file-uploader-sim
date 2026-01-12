import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from '../../styles/Success.module.css';

export default function Success() {
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/files', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
        }
      } catch (error) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  const handleShareMore = () => {
    router.push('/upload');
  };

  const handleGoToDashboard = () => {
    router.push('/files');
  };

  return (
    <Layout>
      <div className={styles.card}>
        <div className={styles.badge}>Uploading Completed</div>
        
        <h1 className={styles.title}>Files Uploaded Successfully</h1>
        <p className={styles.subtitle}>
          Files are being processed for review online.
        </p>

        <div className={styles.iconContainer}>
          <div className={styles.documentIcon}>
            <svg width="60" height="60" viewBox="0 0 60 60" fill="none">
              <rect x="12" y="8" width="36" height="44" rx="2" stroke="currentColor" strokeWidth="2"/>
              <path d="M20 20H40M20 28H40M20 36H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="42" cy="18" r="6" fill="currentColor"/>
              <text x="42" y="22" textAnchor="middle" fill="white" fontSize="10" fontWeight="bold">U</text>
            </svg>
          </div>
        </div>

        <h2 className={styles.allSet}>You're all set!</h2>
        <p className={styles.instructions}>
          Share more files or head back to the dashboard
        </p>

        <div className={styles.actions}>
          <button className={styles.shareButton} onClick={handleShareMore}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 7.5C15.8284 7.5 16.5 6.82843 16.5 6C16.5 5.17157 15.8284 4.5 15 4.5C14.1716 4.5 13.5 5.17157 13.5 6C13.5 6.82843 14.1716 7.5 15 7.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5 12.5C5.82843 12.5 6.5 11.8284 6.5 11C6.5 10.1716 5.82843 9.5 5 9.5C4.17157 9.5 3.5 10.1716 3.5 11C3.5 11.8284 4.17157 12.5 5 12.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M13.5 6L6.5 11M6.5 11V15.5M6.5 11H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Share more files</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <button className={styles.dashboardButton} onClick={handleGoToDashboard}>
            Go to Dashboard
          </button>
        </div>
      </div>
    </Layout>
  );
}
