import styles from '../styles/FileList.module.css';

export default function FileList({ files, onRemove }) {
  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <div className={styles.fileList}>
      {files.map((file, index) => (
        <div key={index} className={styles.fileItem}>
          <div className={styles.fileInfo}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className={styles.checkIcon}>
              <path d="M16.6667 5L7.50004 14.1667L3.33337 10" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <div className={styles.fileDetails}>
              <span className={styles.fileName}>{file.name}</span>
              <span className={styles.fileSize}>{formatFileSize(file.size)}</span>
            </div>
          </div>
          <button
            className={styles.removeButton}
            onClick={() => onRemove(index)}
            aria-label="Remove file"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
      ))}
    </div>
  );
}
