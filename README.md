# File Uploader Sim

Demonstration project for file upload that only save metadata, with authentication, Next.js frontend and Express/Node.js backend.

## Description

Complete file upload system that allows users to:
- Login with predefined credentials
- Select and "upload" files
- View upload progress
- View a list of all uploaded files

The project follows a dark "Hearsay" style design with a complete screen flow.

## Project Structure

```
file-uploader-sim/
├── backend/          # Express API with Node.js
│   ├── database.js   # SQLite configuration
│   ├── index.js      # Main Express server
│   ├── middleware/   # Authentication and error middleware
│   └── tests/        # Backend tests
├── frontend/         # Next.js application (React)
│   ├── pages/        # Application pages
│   ├── components/   # Reusable components
│   ├── styles/       # CSS styles
│   └── lib/          # Utilities
└── README.md
```

## Technologies

### Backend
- **Node.js** + **Express** - REST API server
- **SQLite** - Persistent database for metadata
- **JWT** - Token-based authentication
- **Jest** + **Supertest** - Testing

### Frontend
- **Next.js 14** - React framework
- **React 18** - UI library
- **CSS Modules** - Modular styles

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Steps

1. **Clone the repository** (or navigate to the project directory)

2. **Install backend dependencies:**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies:**
   ```bash
   cd ../frontend
   npm install
   ```

## Running

### Development

1. **Start the backend** (port 4000):
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend** (port 3000):
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application:**
   - Open browser at `http://localhost:3000`
   - You will be automatically redirected to login

### Production

1. **Build the frontend:**
   ```bash
   cd frontend
   npm run build
   npm start
   ```

2. **Start the backend** (with environment variables if needed):
   ```bash
   cd backend
   npm start
   ```

## Access Credentials

- **Username:** `demo`
- **Password:** `demo123`

## Application Flow

1. **Login** (`/login`) - Authentication with username and password
2. **Dashboard** (`/dashboard`) - Initial screen with selection options
3. **Social Selection** (`/social-selection`) - Social media platform selection (Facebook, Instagram, Threads)
4. **Upload** (`/upload`) - File selection and preparation for upload
5. **Progress** (`/upload/progress`) - Progress screen during upload
6. **Success** (`/upload/success`) - Upload success confirmation
7. **Files** (`/files`) - List of all uploaded files

## API Endpoints

### Authentication
- `POST /api/login` - Login
  - Body: `{ username: string, password: string }`
  - Response: `{ success: boolean, token: string }`

- `POST /api/logout` - Logout
  - Response: `{ success: boolean, message: string }`

### Files
- `POST /api/upload` - Upload file metadata (requires authentication)
  - Body: `{ files: [{ name: string, size: number }, ...] }`
  - Response: `{ success: boolean, files: Array, count: number }`

- `GET /api/files` - List uploaded files (requires authentication)
  - Response: `{ success: boolean, files: Array }`

## Database

The SQLite database is automatically created at `backend/database.sqlite` when the server starts.

### Schema
```sql
CREATE TABLE files (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  size INTEGER NOT NULL,
  uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Testing

### Run backend tests:
```bash
cd backend
npm test
```

### Included tests:
- Authentication tests (`backend/tests/auth.test.js`)
- Database tests (`backend/tests/files.test.js`)

## Features

- ✅ JWT authentication with httpOnly cookies
- ✅ Route protection with middleware
- ✅ Backend data validation
- ✅ Centralized error handling
- ✅ Responsive design
- ✅ Smooth animations and transitions
- ✅ Unit tests
- ✅ Persistent database
- ✅ File metadata (name, size, date)

## Important Notes

- **Files are NOT physically stored** - Only metadata is saved (name and size)
- The SQLite database is created in the `backend/` directory
- Authentication cookies are httpOnly for enhanced security
- The frontend uses Next.js proxy for API calls (`/api/*` → `http://localhost:4000/api/*`)

## Development and Contribution

### Code structure:
- Backend uses ES modules (`"type": "module"`)
- Frontend uses Next.js with App Router (pages directory)
- Styles use CSS Modules to avoid conflicts

### Environment variables (optional):
Create `.env` in `backend/`:
```
PORT=4000
JWT_SECRET=your-secret-key-here
NODE_ENV=development
```

## Deployment

The project can be deployed to:
- **Frontend:** Vercel, Netlify, or any static hosting service
- **Backend:** Railway, Render, Heroku, or any Node.js service
- **Database:** SQLite can be kept or migrated to PostgreSQL/MySQL as needed

## License

This project is a demonstration and can be freely used for educational purposes.
