import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../components/Layout';
import styles from '../styles/Dashboard.module.css';

export default function Dashboard() {
  const router = useRouter();

  useEffect(() => {
    // Check authentication
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

  const handleUploadFiles = () => {
    router.push('/upload');
  };

  const handleNonPhoneSource = () => {
    router.push('/social-selection?device=non-phone');
  };

  const handleDeviceSelect = (deviceType) => {
    router.push(`/social-selection?device=${deviceType}`);
  };

  return (
    <Layout>
      <div className={styles.card}>
        <div className={styles.badge}>Starting Extraction</div>
        
        <h1 className={styles.title}>Hearsay Extraction Assistant</h1>
        <p className={styles.subtitle}>
          Follow the instructions below to prepare for an extraction.
        </p>

        <div className={styles.deviceOptions}>
          <div 
            className={styles.deviceOption}
            onClick={() => handleDeviceSelect('iphone')}
          >
            <div className={styles.deviceIconContainer}>
              <div className={styles.deviceImageWrapper}>
                <Image 
                  src="/iphone-image.png" 
                  alt="iPhone" 
                  width={120} 
                  height={120}
                  className={styles.deviceImage}
                />
              </div>
            </div>
            <h3 className={styles.deviceTitle}>iPhone</h3>
            <p className={styles.deviceSubtitle}>iOS versions 11.1+</p>
          </div>

          <div 
            className={styles.deviceOption}
            onClick={() => handleDeviceSelect('android')}
          >
            <div className={styles.deviceIconContainer}>
              <div className={styles.deviceImageWrapper}>
                <Image 
                  src="/android-image.png" 
                  alt="Android" 
                  width={120} 
                  height={120}
                  className={styles.deviceImage}
                />
              </div>
            </div>
            <h3 className={styles.deviceTitle}>Android</h3>
            <p className={styles.deviceSubtitle}>OS version 11.1+</p>
          </div>
        </div>

        <div className={styles.uploadOptions}>
          <button 
            className={styles.optionButton}
            onClick={handleNonPhoneSource}
          >
            <span>Extract from a Non-Phone Source</span>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M7.5 15L12.5 10L7.5 5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>

          <div className={styles.separator}>
            <span>Or</span>
          </div>

          <button 
            className={styles.uploadButton}
            onClick={handleUploadFiles}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M14.1667 6.66667L10 2.5M10 2.5L5.83333 6.66667M10 2.5V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Upload Files</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}
