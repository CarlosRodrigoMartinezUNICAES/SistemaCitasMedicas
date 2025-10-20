
# Copilot Instructions for Sistema de Citas Médicas

## Project Overview
Minimal medical appointment management system using React + Vite (TypeScript) for the frontend and Express + MariaDB for the backend. All custom styling, UI components, and assets have been removed for simplicity. The UI is fully responsive and adapts to mobile, tablet, and desktop screens. On wide displays, the landing page shows login cards side by side horizontally. Transitions are smooth and always scroll to top before navigating to avoid visual flash.

## Architecture

### Database (MariaDB)
- Strict ID patterns for all entities (see `SistemaCitasMedicasMariaDB.sql`)
- Data validation enforced at DB level (names, phone, email, DUI, age)


### Frontend
- Only essential React components in `/client/src/pages/`
- No custom CSS, UI libraries, or assets
- API calls via axios (see `Login.tsx`)
- Responsive/adaptive UI: All pages fit 720p and mobile screens. Landing page cards display horizontally on wide screens.
- Transitions always scroll to top before navigating to avoid flash when scrolled.

### Backend
- Express + TypeScript in `/server`
- Database pooling via MariaDB (`utils/db.ts`)
- RESTful routes in `routes/`

## Development Workflow
1. Import DB schema: `source SistemaCitasMedicasMariaDB.sql`
2. Backend: `cd server && npm install && npm run dev`
3. Frontend: `cd client && npm install && npm run dev`

## Project Conventions
- Pages in `/client/src/pages/` (e.g., `LandingPage.tsx`, `Login.tsx`)
- Components use TypeScript interfaces for props
- No custom styling or UI libraries
- API error responses: `{ success: false, message: string }`
- Always validate data against DB constraints

## Cleanup Notes
- All custom UI components, utility files, CSS, and assets have been removed
- Only essential imports and files remain

## Common Tasks
- Add new pages in `/client/src/pages/`
- Add backend routes in `/server/src/routes/`
- Follow DB validation rules for all data
- For responsive UI, use percentage widths, maxWidth, and media queries as shown in `LandingPage.tsx`.