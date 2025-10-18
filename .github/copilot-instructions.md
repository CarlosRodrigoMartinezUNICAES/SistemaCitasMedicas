# Copilot Instructions for Sistema de Citas Médicas

## Project Overview
This is a medical appointment management system built with React + Vite (frontend) and MariaDB (backend). The system manages doctors, patients, appointments, and consultations.

## Architecture

### Database Structure
- The database schema (`SistemaCitasMedicasMariaDB.sql`) follows strict validation rules:
  - IDs follow specific patterns (e.g., `P[0-9].*` for patients, `E[0-9].*` for specialties)
  - Names must contain only letters and spaces (regex: `^[A-Za-zÁÉÍÓÚÑáéíóúñ ]+$`)
  - Phone numbers must be 8 digits starting with 2, 6, or 7
  - DUI (national ID) format: `^[0-9]{8}-[0-9]$`

### Frontend Structure
- `/client` - React + TypeScript + Vite application
  - `/src/pages` - Page components (e.g., `Login.tsx`)
  - Core styling uses CSS variables defined in login component for consistent theming

## Development Workflow

### Setup Steps
1. Database:
   - Import schema from `SistemaCitasMedicasMariaDB.sql` into MariaDB

2. Frontend:
   ```bash
   cd client
   npm install
   npm run dev
   ```

### Project Conventions
1. **TypeScript**:
   - Strict type checking enabled
   - React components use `React.FC` type

2. **Styling**:
   - CSS variables for theming (see `Login.tsx` for reference)
   - Common variables:
     - `--primary-color`, `--accent-color`
     - `--bg-gradient`, `--card-bg`
     - `--text-primary`, `--text-secondary`
     - `--shadow-sm`, `--shadow-md`, `--shadow-lg`

3. **Data Validation**:
   - Follow database constraints when handling form data
   - Implement client-side validation matching DB patterns

## Integration Points
- Frontend-Database communication patterns to be implemented
- Authentication flow through `Usuario` table with password hashing
- Session management to be added

## Common Tasks
- Creating new pages: Add component in `/client/src/pages`
- Database modifications: Follow patterns in `SistemaCitasMedicasMariaDB.sql`
- Style changes: Update CSS variables in theme