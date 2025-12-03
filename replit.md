# Fincred Gift Exchange Portal

## Overview

This is an internal employee engagement web application for Fincred Finance that manages Secret Santa-style gift exchanges. The application allows administrators to create exchange events, add participants with their gift preferences, and automatically assign Secret Santa matches. Employees can then log in to view their assigned recipient and their wishlist preferences.

The application is built as a full-stack TypeScript solution with a React frontend and Express backend, using PostgreSQL for data persistence.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React with TypeScript using Vite as the build tool and development server.

**UI Component Library**: The application uses shadcn/ui components built on Radix UI primitives. This provides a consistent, accessible component system with pre-built patterns for dialogs, cards, buttons, forms, and more.

**Styling Approach**: Tailwind CSS v4 for utility-first styling with a custom design system featuring corporate blue and white color palette. CSS variables are used for theming, defined in `client/src/index.css`.

**State Management**: React Context API via `ExchangeProvider` (`client/src/lib/exchange-context.tsx`) manages global state for exchanges, participants, and current user session. This eliminates prop drilling and provides centralized data access across components.

**Routing**: wouter is used for client-side routing, providing a lightweight alternative to React Router. Routes are defined in `client/src/App.tsx`.

**Data Fetching**: TanStack Query (React Query) handles server state management, caching, and data synchronization with the backend API.

### Backend Architecture

**Framework**: Express.js server with TypeScript, serving both API endpoints and static assets.

**API Design**: RESTful API structure with routes defined in `server/routes.ts`:
- `/api/exchanges` - CRUD operations for gift exchange events
- `/api/participants` - Participant management
- `/api/auth/login` - Employee authentication

**Storage Layer**: Abstracted through an `IStorage` interface (`server/storage.ts`) with a `DatabaseStorage` implementation. This abstraction allows for easy swapping of data sources if needed.

**Development Setup**: In development mode, Vite middleware is integrated into the Express server for hot module replacement. Production mode serves pre-built static assets from the `dist/public` directory.

### Database Architecture

**ORM**: Drizzle ORM provides type-safe database queries and schema management.

**Database**: PostgreSQL via Neon serverless driver (`@neondatabase/serverless`). The connection uses WebSocket for compatibility with serverless environments.

**Schema Design** (defined in `shared/schema.ts`):
- **exchanges** table: Stores gift exchange events with title, date, budget, and status
- **participants** table: Stores participant information with foreign key to exchanges, includes name, email, password, suggestions, wishlist array, and assignedToId for Secret Santa matching

**Migrations**: Drizzle Kit manages schema migrations with configuration in `drizzle.config.ts`. Migrations are generated in the `/migrations` directory.

### Authentication & Authorization

**Strategy**: Simple credential-based authentication with separate admin and employee login flows.

**Admin Access**: Hardcoded credentials stored in `client/src/pages/admin-login.tsx` (email: admin@fincred.com, password: fincred2025). Session stored in localStorage.

**Employee Access**: Database-verified login with email and password via `/api/auth/login` endpoint. Default password is "fincred2025" for all participants. Session managed through React Context with participant data (excluding password) stored on the client.

**Data Persistence**: All exchanges and participants are stored in PostgreSQL, enabling login access from any device. When admins add participants through the admin dashboard, those participants can immediately login using the employee portal from any device or browser.

**Security Note**: This is designed for internal use with basic authentication. Passwords are stored in plaintext in the database. Production deployment would require proper password hashing, JWT or session-based auth, and HTTPS enforcement.

### Build & Deployment

**Build Process**: Custom build script (`script/build.ts`) uses:
- Vite for client-side bundle optimization
- esbuild for server-side code bundling with selective dependency bundling

**Bundle Strategy**: Frequently-used server dependencies (Drizzle, Express, etc.) are bundled into the server output to reduce cold start times by minimizing file system operations.

**Production Server**: Runs the compiled server from `dist/index.cjs` which serves pre-built client assets from `dist/public`.

## External Dependencies

### Core Dependencies

- **@neondatabase/serverless**: PostgreSQL database driver optimized for serverless/edge environments
- **drizzle-orm**: Type-safe ORM for database operations
- **drizzle-zod**: Integration between Drizzle schemas and Zod validation

### Frontend Libraries

- **React 18**: UI framework
- **wouter**: Lightweight client-side routing
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Headless UI component primitives (accordion, dialog, dropdown, etc.)
- **tailwindcss**: Utility-first CSS framework
- **canvas-confetti**: Celebration animations for successful Secret Santa assignments
- **lucide-react**: Icon library

### Backend Libraries

- **express**: Web server framework
- **connect-pg-simple**: PostgreSQL session store (currently unused but available)
- **ws**: WebSocket library required by Neon driver

### Development Tools

- **vite**: Build tool and dev server
- **tsx**: TypeScript execution for development
- **typescript**: Type system
- **@replit/vite-plugin-***: Replit-specific plugins for development experience enhancements

### Validation & Type Safety

- **zod**: Runtime type validation for API inputs
- **zod-validation-error**: User-friendly error messages from Zod validation failures