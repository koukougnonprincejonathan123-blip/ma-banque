# Overview

This is a mobile-first banking simulation application styled after Attijariwafa Bank (Moroccan bank). It provides a complete banking interface including user authentication, account dashboard, money transfers, and transaction history. The app is designed as a single-page application with a React frontend and Express backend, using PostgreSQL for data persistence.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Animations**: Framer Motion for transitions and micro-interactions
- **Build Tool**: Vite with hot module replacement

The frontend follows a pages-based structure under `client/src/pages/` with shared components in `client/src/components/`. Custom hooks in `client/src/hooks/` handle authentication (`use-auth.ts`) and banking operations (`use-banking.ts`).

## Backend Architecture
- **Framework**: Express 5 on Node.js
- **Session Management**: express-session with MemoryStore (development) / connect-pg-simple (production ready)
- **API Design**: REST endpoints defined in `shared/routes.ts` with Zod schema validation

The server structure separates concerns:
- `server/routes.ts` - API route handlers
- `server/storage.ts` - Database abstraction layer (IStorage interface)
- `server/db.ts` - Drizzle ORM database connection
- `server/vite.ts` - Development server with Vite middleware
- `server/static.ts` - Production static file serving

## Data Layer
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: `shared/schema.ts` (shared between frontend/backend)
- **Migrations**: Drizzle Kit with output to `./migrations`

Database tables:
- `users` - Authentication (username, password, fullName)
- `accounts` - Bank accounts (balance, IBAN, BIC, isActive flag)
- `transactions` - Transaction history (type, amount, beneficiary, isRead for notifications)

## Shared Code
The `shared/` directory contains code used by both frontend and backend:
- `schema.ts` - Drizzle table definitions and Zod insert schemas
- `routes.ts` - API endpoint definitions with request/response schemas

## Build System
- Development: Vite dev server with Express API proxy
- Production: esbuild bundles server code, Vite builds client to `dist/public`
- The build script (`script/build.ts`) bundles specific dependencies to reduce cold start times

# External Dependencies

## Database
- **PostgreSQL** via `DATABASE_URL` environment variable
- Connection pooling with `pg` (node-postgres)

## UI Components
- **shadcn/ui** components configured in `components.json`
- Radix UI primitives for accessible components
- Lucide React for icons

## Key Runtime Dependencies
- `drizzle-orm` / `drizzle-zod` - Database ORM and schema validation
- `@tanstack/react-query` - Server state management
- `framer-motion` - Animation library
- `react-confetti` - Success celebration effects
- `date-fns` - Date formatting (French locale support)

## Environment Variables Required
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - Express session secret (optional, has default for dev)