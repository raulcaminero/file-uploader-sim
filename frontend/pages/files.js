import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import styles from '../styles/Files.module.css';

export default function Files() {
  const router = useRouter();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check authentication and load files
    const loadFiles = async () => {
      try {
        const res = await fetch('/api/files', { credentials: 'include' });
        
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/login');
            return;
          }
          throw new Error('Error loading files');
        }

        const data = await res.json();
        if (data.success) {
          setFiles(data.files);
        } else {
          setError(data.message || 'Error loading files');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Connection error. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadFiles();
  }, [router]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <Layout>
        <div className={styles.card}>
          <div className={styles.loading}>Loading files...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.card}>
        <h1 className={styles.title}>Uploaded Files</h1>
        <p className={styles.subtitle}>
          List of all files you have uploaded
        </p>

        {error && <div className={styles.error}>{error}</div>}

        {files.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className={styles.emptyIcon}>
              <rect x="16" y="12" width="32" height="40" rx="2" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
              <path d="M24 24H40M24 32H40M24 40H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>No files uploaded yet</p>
            <button 
              className={styles.uploadButton}
              onClick={() => router.push('/upload')}
            >
              Upload Files
            </button>
          </div>
        ) : (
          <>
            <div className={styles.stats}>
              Total files: <strong>{files.length}</strong>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Size</th>
                    <th>Upload Date</th>
                  </tr>
                </thead>
                <tbody>
                  {files.map((file) => (
                    <tr key={file.id}>
                      <td className={styles.fileName}>{file.name}</td>
                      <td className={styles.fileSize}>{formatFileSize(file.size)}</td>
                      <td className={styles.fileDate}>{formatDate(file.uploaded_at)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className={styles.actions}>
              <button 
                className={styles.actionButton}
                onClick={() => router.push('/upload')}
              >
                Upload More Files
              </button>
              <button 
                className={styles.actionButtonSecondary}
                onClick={() => router.push('/dashboard')}
              >
                Back to Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
