# Copilot Instructions for Sistema de Citas Médicas

## Project Overview
A medical appointment management system built with React + Vite (TypeScript) frontend and Express + MariaDB backend. The system manages doctors, patients, appointments, and consultations with strict data validation rules.

## Architecture

### Database Design (MariaDB)
- All database entities have strict ID format patterns:
  - Patients: `P[0-9].*` (e.g., `P0001`)
  - Doctors: `D[0-9].*` (e.g., `D0001`)
  - Specialties: `E[0-9].*` (e.g., `E0001`)
  - Appointments: `C[0-9].*` (e.g., `C0001`)
  - Consultations: `CO[0-9].*` (e.g., `CO0001`)

- Data Validation Rules (see `SistemaCitasMedicasMariaDB.sql`):
  - Names: `^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$` (letters, spaces, Spanish accents)
  - Phone: `^[267][0-9]{7}$` (8 digits, starts with 2/6/7)
  - DUI (ID): `^[0-9]{8}-[0-9]$` (e.g., `12345678-9`)
  - Email: `_%@_%._%` format
  - Ages: Between 0-120

### Frontend Architecture
- React + TypeScript + Vite in `/client`
- Key features:
  - Strong TypeScript typing with `React.FC<Props>` pattern
  - API communication via axios (see `Login.tsx`)
  - CSS variables for theming

### Backend Architecture
- Express + TypeScript in `/server`
- Key features:
  - Database pooling with MariaDB (`utils/db.ts`)
  - RESTful routes in `routes/` directory
  - Environment variables via dotenv

## Development Workflow

### Setup Steps
1. Database Setup:
   ```sql
   source SistemaCitasMedicasMariaDB.sql
   ```

2. Backend:
   ```bash
   cd server
   npm install
   npm run dev    # Development with hot-reload
   # or
   npm run build  # Production build
   npm run serve  # Run production build
   ```

3. Frontend:
   ```bash
   cd client
   npm install
   npm run dev    # Development server
   # or
   npm run build  # Production build
   ```

## Project Conventions

### Component Structure
- Pages go in `/client/src/pages/`
- Components use TypeScript interfaces for props
- Example from `Login.tsx`:
  ```typescript
  interface LoginProps {
    userType: 'Paciente' | 'Doctor';
    onBack: () => void;
  }
  const Component: React.FC<LoginProps> = ({ prop }) => { ... }
  ```

### API Integration
- Backend API endpoints follow RESTful patterns
- Frontend uses axios for API calls
- Standard error response format:
  ```typescript
  {
    success: false,
    message: string
  }
  ```

### Database Access
- Use connection pool from `db.ts`
- Always validate data against schema constraints
- Use prepared statements to prevent SQL injection

### CSS Conventions
Root variables in frontend theme:
```css
:root {
  --primary-color
  --accent-color
  --bg-gradient
  --card-bg
  --text-primary
  --text-secondary
  --shadow-sm/md/lg
}
```

## Common Tasks

### Adding New Routes
1. Create route file in `server/src/routes/`
2. Import and use in `index.ts`
3. Add TypeScript interfaces for request/response

### Creating New Pages
1. Add TypeScript interface for props
2. Create component in `/client/src/pages/`
3. Use CSS variables for styling

### Database Operations
- Follow ID patterns strictly
- Implement all validation rules client-side
- Use MariaDB constraints as source of truth