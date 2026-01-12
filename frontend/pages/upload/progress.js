import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import styles from '../../styles/Progress.module.css';

export default function Progress() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    // Verificar autenticación
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/files', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
      } catch (error) {
        router.push('/login');
        return;
      }
    };
    checkAuth();

    // Simular progreso de subida
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          // Redirigir a success después de completar
          setTimeout(() => {
            router.push('/upload/success');
          }, 500);
          return 100;
        }
        // Incremento variable para efecto más realista
        const increment = prev < 50 ? Math.random() * 15 + 5 : Math.random() * 8 + 2;
        return Math.min(prev + increment, 100);
      });
    }, 300);

    // Timer
    const timerInterval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      clearInterval(interval);
      clearInterval(timerInterval);
    };
  }, [router]);

  const formatTime = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Layout>
      <div className={styles.card}>
        <div className={styles.badge}>Uploading In Progress</div>
        
        <h1 className={styles.title}>File Upload</h1>
        <p className={styles.subtitle}>Files are being uploaded...</p>

        <div className={styles.progressContainer}>
          <div className={styles.iconContainer}>
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none" className={styles.cloudIcon}>
              <path d="M25 35C22.2386 35 20 37.2386 20 40C20 42.7614 22.2386 45 25 45H55C57.7614 45 60 42.7614 60 40C60 37.2386 57.7614 35 55 35C54.7159 32.595 53.6362 30.3469 51.9268 28.6375C50.2174 26.9281 47.9693 25.8484 45.5643 25.5643C43.1593 25.2802 40.7264 25.8144 38.6667 27.0833C36.607 25.8144 34.1741 25.2802 31.7691 25.5643C29.3641 25.8484 27.116 26.9281 25.4066 28.6375C23.6972 30.3469 22.6175 32.595 22.3333 35H25Z" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M40 35V55M40 35L35 40M40 35L45 40" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>

          <div className={styles.timer}>{formatTime(seconds)}</div>

          <div className={styles.progressBarContainer}>
            <div 
              className={styles.progressBar}
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className={styles.uploadingText}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.spinner}>
              <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="2" strokeDasharray="37.7" strokeDashoffset="18.85" strokeLinecap="round">
                <animateTransform
                  attributeName="transform"
                  type="rotate"
                  from="0 8 8"
                  to="360 8 8"
                  dur="1s"
                  repeatCount="indefinite"
                />
              </circle>
            </svg>
            <span>Uploading</span>
          </div>
        </div>

        <div className={styles.warning}>
          Do Not Close App While Processing
        </div>
      </div>
    </Layout>
  );
}
