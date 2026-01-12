import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/Layout';
import FileList from '../../components/FileList';
import styles from '../../styles/Upload.module.css';

export default function Upload() {
  const router = useRouter();
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

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

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files);
    const newFiles = files.map(file => ({
      name: file.name,
      size: file.size,
      file: file // Mantener referencia al archivo original para validación
    }));

    setSelectedFiles(prev => [...prev, ...newFiles]);
    setError('');
    // Resetear el input para permitir seleccionar el mismo archivo de nuevo
    e.target.value = '';
  };

  const handleRemoveFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      setError('Por favor, selecciona al menos un archivo');
      return;
    }

    setUploading(true);
    setError('');

    try {
      // Preparar metadata de archivos (sin el objeto File)
      const filesMetadata = selectedFiles.map(file => ({
        name: file.name,
        size: file.size
      }));

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ files: filesMetadata })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        // Guardar información de archivos subidos en sessionStorage para la página de progreso
        sessionStorage.setItem('uploadedFiles', JSON.stringify(data.files));
        router.push('/upload/progress');
      } else {
        setError(data.message || 'Error al subir archivos');
        setUploading(false);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error de conexión. Por favor, intenta de nuevo.');
      setUploading(false);
    }
  };

  return (
    <Layout>
      <div className={styles.card}>
        <div className={styles.badge}>Starting Extraction</div>
        
        <h1 className={styles.title}>File Upload</h1>
        <p className={styles.subtitle}>Select files to upload for review</p>

        <div className={styles.uploadSection}>
          <div className={styles.fileInputWrapper}>
            <div className={styles.fileInputContent}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className={styles.folderIcon}>
                <path d="M3 7V5C3 3.89543 3.89543 3 5 3H9.58579C9.851 3 10.1054 3.10536 10.2929 3.29289L12.7071 5.70711C12.8946 5.89464 13.149 6 13.4142 6H19C20.1046 6 21 6.89543 21 8V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              <span className={styles.fileInputText}>Find files to upload</span>
            </div>
            <label className={styles.browseButton}>
              Browse
              <input
                type="file"
                multiple
                onChange={handleFileSelect}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          </div>

          <FileList files={selectedFiles} onRemove={handleRemoveFile} />

          {error && <div className={styles.error}>{error}</div>}

          <button
            className={styles.uploadButton}
            onClick={handleUpload}
            disabled={uploading || selectedFiles.length === 0}
          >
            {uploading ? 'Uploading...' : 'Upload Now'}
          </button>
        </div>
      </div>
    </Layout>
  );
}
