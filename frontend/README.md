## Project Overview

Thinkr is a real-time multiplayer quiz application built with a Node.js/Express backend and Next.js frontend. It enables hosts to create AI-generated quizzes using Google's Gemini API, and allows multiple players to join and compete in real-time using WebSockets.

## Architecture

### Backend (`/backend`)

-   **Framework**: Node.js with Express.js
-   **Real-time Communication**: Socket.IO for WebSocket connections
-   **Database**: Supabase (PostgreSQL)
-   **AI Integration**: Google Gemini API for quiz generation
-   **Key Structure**:
    -   `index.js` - Main server entry point with Express and Socket.IO setup
    -   `routes/` - API route definitions
    -   `controllers/` - Business logic (quiz creation, game management)
    -   `services/` - External service integrations (Gemini AI, Supabase)
    -   `sockets/` - WebSocket event handlers for real-time game functionality
    -   `api/` - Additional API endpoints (auth, game management)

### Frontend (`/frontend`)

-   **Framework**: Next.js 15 with React 19 and TypeScript
-   **Styling**: Tailwind CSS with Radix UI components
-   **State Management**: React hooks and context
-   **Real-time**: Socket.IO client for WebSocket connections
-   **Key Structure**:
    -   `app/` - Next.js App Router structure with route groups
        -   `(auth)/` - Authentication pages (login/signup)
        -   `(game)/` - Game-related pages (host/player interfaces)
    -   `components/` - Reusable UI components and Radix UI components
    -   `lib/` - Utility functions, types, and API configurations
    -   `hooks/` - Custom React hooks (including useSocket for WebSocket management)

### Data Flow

1. **Quiz Creation**: Host creates quiz → Gemini API generates questions → Stored in Supabase → Game session created with unique code
2. **Game Session**: Players join using game code → WebSocket connections established → Real-time updates via Socket.IO
3. **Database Schema**:
    - `quizzes` table: Stores generated quiz questions and metadata
    - `games` table: Tracks game sessions, participants, leaderboard, and game state

## Common Development Commands

### Backend Development

```bash
# Install dependencies
cd backend && npm install

# Start development server with hot reload
npm run dev

# Start production server
npm start
```

### Frontend Development

```bash
# Install dependencies
cd frontend && npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production build
npm start

# Run linting
npm run lint
```

### Full Stack Development

```bash
# Start both services (run from project root)
# Backend on PORT from .env (Socket.IO server)
cd backend && npm run dev &

# Frontend on http://localhost:3000
cd frontend && npm run dev
```

## Environment Configuration

### Backend (`.env` in `/backend`)

Required environment variables:

-   `PORT` - Server port number
-   `GEMINI_API_KEY` - Google Gemini API key for quiz generation
-   `DB_URL` - Supabase project URL
-   `DB_API_KEY` - Supabase API key

### Frontend

-   Uses Next.js environment variable conventions
-   API endpoints configured to communicate with backend Socket.IO server

## Key Development Patterns

### WebSocket Communication

-   Host and participant connections managed through Socket.IO
-   Events: `host-join-game`, `participant-join-game`, `game-joined`, `participant-updated`
-   Game state synchronized in real-time between all connected clients

### API Integration

-   Gemini AI integration handles dynamic quiz generation based on theme/difficulty
-   Supabase handles persistent data storage with real-time capabilities
-   RESTful API endpoints for quiz creation, complemented by WebSocket for game interactions

### Component Structure

-   Frontend uses shadcn/ui components built on Radix UI
-   Route groups organize authentication and game flows
-   Custom hooks abstract WebSocket connection logic

## Development Notes

-   Backend uses ES6 modules in some services (Gemini, Supabase) mixed with CommonJS
-   Frontend implements Next.js App Router with TypeScript
-   Real-time functionality is central to the application architecture
-   Quiz generation is AI-powered, requiring valid Gemini API credentials
-   Database operations use Supabase client with error handling for connection issues
