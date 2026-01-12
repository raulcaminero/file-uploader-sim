# File Uploader Sim

Proyecto de demostración para subida de archivos (solo metadata) con autenticación, frontend en Next.js y backend en Express/Node.js.

## Descripción

Sistema completo de subida de archivos que permite a los usuarios:
- Iniciar sesión con credenciales predefinidas
- Seleccionar y "subir" archivos (solo se guarda metadata: nombre y tamaño)
- Ver el progreso de la subida
- Visualizar un listado de todos los archivos subidos

El proyecto sigue un diseño oscuro tipo "Hearsay" con flujo completo de pantallas.

## Estructura del Proyecto

```
file-uploader-sim/
├── backend/          # API Express con Node.js
│   ├── database.js   # Configuración de SQLite
│   ├── index.js      # Servidor Express principal
│   ├── middleware/   # Middleware de autenticación y errores
│   └── tests/        # Tests del backend
├── frontend/         # Aplicación Next.js (React)
│   ├── pages/        # Páginas de la aplicación
│   ├── components/   # Componentes reutilizables
│   ├── styles/       # Estilos CSS
│   └── lib/          # Utilidades
└── README.md
```

## Tecnologías

### Backend
- **Node.js** + **Express** - Servidor API REST
- **SQLite** - Base de datos persistente para metadata
- **JWT** - Autenticación con tokens
- **Jest** + **Supertest** - Testing

### Frontend
- **Next.js 14** - Framework React
- **React 18** - Biblioteca UI
- **CSS Modules** - Estilos modulares

## Instalación

### Prerrequisitos
- Node.js (v16 o superior)
- npm o yarn

### Pasos

1. **Clonar el repositorio** (o navegar al directorio del proyecto)

2. **Instalar dependencias del backend:**
   ```bash
   cd backend
   npm install
   ```

3. **Instalar dependencias del frontend:**
   ```bash
   cd ../frontend
   npm install
   ```

## Ejecución

### Desarrollo

1. **Iniciar el backend** (puerto 4000):
   ```bash
   cd backend
   npm start
   ```

2. **Iniciar el frontend** (puerto 3000):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Acceder a la aplicación:**
   - Abrir el navegador en `http://localhost:3000`
   - Serás redirigido automáticamente al login

### Producción

1. **Compilar el frontend:**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Iniciar el backend** (con variables de entorno si es necesario):
   ```bash
   cd backend
   npm start
   ```

## Credenciales de Acceso

- **Usuario:** `demo`
- **Contraseña:** `demo123`

## Flujo de la Aplicación

1. **Login** (`/login`) - Autenticación con usuario y contraseña
2. **Dashboard** (`/dashboard`) - Pantalla inicial con opciones de selección
3. **Upload** (`/upload`) - Selección y preparación de archivos para subir
4. **Progress** (`/upload/progress`) - Pantalla de progreso durante la subida
5. **Success** (`/upload/success`) - Confirmación de subida exitosa
6. **Files** (`/files`) - Listado de todos los archivos subidos

## API Endpoints

### Autenticación
- `POST /api/login` - Iniciar sesión
  - Body: `{ username: string, password: string }`
  - Response: `{ success: boolean, token: string }`

- `POST /api/logout` - Cerrar sesión
  - Response: `{ success: boolean, message: string }`

### Archivos
- `POST /api/upload` - Subir metadata de archivos (requiere autenticación)
  - Body: `{ files: [{ name: string, size: number }, ...] }`
  - Response: `{ success: boolean, files: Array, count: number }`

- `GET /api/files` - Listar archivos subidos (requiere autenticación)
  - Response: `{ success: boolean, files: Array }`

## Base de Datos

La base de datos SQLite se crea automáticamente en `backend/database.sqlite` al iniciar el servidor.

### Esquema
```sql
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Ejecutar tests del backend:
```bash
cd backend
npm test
```

### Tests incluidos:
- Tests de autenticación (`backend/tests/auth.test.js`)
- Tests de base de datos (`backend/tests/files.test.js`)

## Características

- ✅ Autenticación con JWT y cookies httpOnly
- ✅ Protección de rutas con middleware
- ✅ Validación de datos en backend
- ✅ Manejo de errores centralizado
- ✅ Diseño responsive
- ✅ Animaciones y transiciones suaves
- ✅ Tests unitarios
- ✅ Base de datos persistente
- ✅ Metadata de archivos (nombre, tamaño, fecha)

## Notas Importantes

- **Los archivos NO se almacenan físicamente** - Solo se guarda metadata (nombre y tamaño)
- La base de datos SQLite se crea en el directorio `backend/`
- Las cookies de autenticación son httpOnly para mayor seguridad
- El frontend usa proxy de Next.js para las llamadas API (`/api/*` → `http://localhost:4000/api/*`)

## Desarrollo y Contribución

### Estructura de código:
- El backend usa ES modules (`"type": "module"`)
- El frontend usa Next.js con App Router (pages directory)
- Los estilos usan CSS Modules para evitar conflictos

### Variables de entorno (opcional):
Crear `.env` en `backend/`:
```
PORT=4000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Despliegue

El proyecto puede desplegarse en:
- **Frontend:** Vercel, Netlify, o cualquier servicio de hosting estático
- **Backend:** Railway, Render, Heroku, o cualquier servicio Node.js
- **Base de datos:** SQLite puede mantenerse o migrarse a PostgreSQL/MySQL según necesidades

## Licencia

Este proyecto es una demostración y puede usarse libremente para propósitos educativos.
