// Middleware de manejo de errores centralizado
export function errorHandler(err, req, res, next) {
  console.error('Error:', err);

  // Errores de validación
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: err.message || 'Error de validación'
    });
  }

  // Errores de base de datos
  if (err.code && err.code.startsWith('SQLITE')) {
    return res.status(500).json({
      success: false,
      message: 'Error en la base de datos'
    });
  }

  // Error por defecto
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor'
  });
}

// Middleware para manejar rutas no encontradas
export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada'
  });
}
