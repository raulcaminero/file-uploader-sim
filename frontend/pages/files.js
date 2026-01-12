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
    // Verificar autenticación y cargar archivos
    const loadFiles = async () => {
      try {
        const res = await fetch('/api/files', { credentials: 'include' });
        
        if (!res.ok) {
          if (res.status === 401 || res.status === 403) {
            router.push('/login');
            return;
          }
          throw new Error('Error al cargar archivos');
        }

        const data = await res.json();
        if (data.success) {
          setFiles(data.files);
        } else {
          setError(data.message || 'Error al cargar archivos');
        }
      } catch (error) {
        console.error('Error:', error);
        setError('Error de conexión. Por favor, intenta de nuevo.');
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
    return date.toLocaleString('es-ES', {
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
          <div className={styles.loading}>Cargando archivos...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className={styles.card}>
        <h1 className={styles.title}>Archivos Subidos</h1>
        <p className={styles.subtitle}>
          Lista de todos los archivos que has subido
        </p>

        {error && <div className={styles.error}>{error}</div>}

        {files.length === 0 ? (
          <div className={styles.empty}>
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" className={styles.emptyIcon}>
              <rect x="16" y="12" width="32" height="40" rx="2" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4"/>
              <path d="M24 24H40M24 32H40M24 40H32" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
            <p>No hay archivos subidos aún</p>
            <button 
              className={styles.uploadButton}
              onClick={() => router.push('/upload')}
            >
              Subir Archivos
            </button>
          </div>
        ) : (
          <>
            <div className={styles.stats}>
              Total de archivos: <strong>{files.length}</strong>
            </div>
            <div className={styles.tableContainer}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Nombre</th>
                    <th>Tamaño</th>
                    <th>Fecha de Subida</th>
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
                Subir Más Archivos
              </button>
              <button 
                className={styles.actionButtonSecondary}
                onClick={() => router.push('/dashboard')}
              >
                Volver al Dashboard
              </button>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
