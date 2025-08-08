# Musikkhylla

A visual music rack application with drag-and-drop album management and user authentication.

## Features

- **Visual Album Display**: Albums shown as spines with vertical text (like a real music rack)
- **Interactive Management**: Click to view album details, drag-and-drop to reorder
- **User Authentication**: Email-based login with 6-digit verification codes (Notion-style)
- **Personal Collections**: Each user can manage their own music collection
- **Streaming Integration**: Links to Spotify, Apple Music, Tidal, and other services
- **Modern Tech Stack**: React frontend with FastAPI backend

## Project Structure

This is a monorepo containing:

- `frontend/` - React + Vite application with styled-components
- `backend/` - FastAPI application using uv for package management

## Quick Start

1. **Install dependencies:**
   ```bash
   npm run install:all
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

3. **Access the application:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - API Documentation: http://localhost:3001/docs

## Authentication

- Email-based authentication with verification codes
- Development: Login codes are displayed in the backend console
- Production: Codes will be sent via email

## Tech Stack

### Frontend
- React with Vite
- styled-components for CSS-in-JS
- Axios for API communication
- React DnD for drag-and-drop functionality

### Backend
- FastAPI for high-performance API
- SQLAlchemy 2.0 for database ORM
- PostgreSQL for data storage
- JWT tokens for authentication
- UV for fast Python package management

## Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies

## License

MIT
