import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Layout from '../components/Layout';
import styles from '../styles/SocialSelection.module.css';

export default function SocialSelection() {
  const router = useRouter();
  const { device } = router.query; // 'iphone' or 'android'

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

  const handleSocialSelect = (socialMedia) => {
    // You can add specific logic for each social media platform here
    router.push('/upload');
  };

  const handleUploadFiles = () => {
    router.push('/upload');
  };

  const handleBack = () => {
    router.push('/dashboard');
  };

  return (
    <Layout>
      <div className={styles.card}>
        <div className={styles.badge}>Starting Extraction</div>
        
        <h1 className={styles.title}>Hearsay Extraction Assistant</h1>
        <p className={styles.subtitle}>
          Follow the instructions below to prepare for an extraction device.
        </p>

        <div className={styles.socialOptions}>
          <div 
            className={styles.socialOption}
            onClick={() => handleSocialSelect('facebook')}
          >
            <div className={styles.socialIconContainer}>
              <Image 
                src="/facebook-logo.png" 
                alt="Facebook" 
                width={80} 
                height={80}
                className={styles.socialIcon}
              />
            </div>
            <h3 className={styles.socialTitle}>Facebook</h3>
          </div>

          <div 
            className={styles.socialOption}
            onClick={() => handleSocialSelect('instagram')}
          >
            <div className={styles.socialIconContainer}>
              <Image 
                src="/instagram-logo.png" 
                alt="Instagram" 
                width={80} 
                height={80}
                className={styles.socialIcon}
              />
            </div>
            <h3 className={styles.socialTitle}>Instagram</h3>
          </div>

          <div 
            className={styles.socialOption}
            onClick={() => handleSocialSelect('threads')}
          >
            <div className={styles.socialIconContainer}>
              <Image 
                src="/threads-logo.png" 
                alt="Threads" 
                width={80} 
                height={80}
                className={styles.socialIcon}
              />
            </div>
            <h3 className={styles.socialTitle}>Threads</h3>
          </div>
        </div>

        <div className={styles.uploadOptions}>
          <button 
            className={styles.uploadButton}
            onClick={handleUploadFiles}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M17.5 12.5V15.8333C17.5 16.2754 17.3244 16.6993 17.0118 17.0118C16.6993 17.3244 16.2754 17.5 15.8333 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V12.5M14.1667 6.66667L10 2.5M10 2.5L5.83333 6.66667M10 2.5V12.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <span>Or, Upload Files</span>
          </button>
        </div>

        <div className={styles.backButton}>
          <button onClick={handleBack} className={styles.backLink}>
            Back
          </button>
        </div>
      </div>
    </Layout>
  );
}
