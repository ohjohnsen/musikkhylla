# Musikkhylla

A visual music rack application with drag-and-drop album management.

## Features

- **Visual Album Display**: Albums shown as spines with vertical text (like a real music rack)
- **Interactive Management**: Click to view album details, drag-and-drop to reorder
- **Streaming Integration**: Links to Spotify, Apple Music, Tidal, and other services
- **Personal Collections**: Each user can manage their own music collection
- **Modern Tech Stack**: React frontend with Python Flask backend

## Project Structure

This is a monorepo containing:

- `frontend/` - React + Vite application with styled-components
- `backend/` - Python Flask API using uv for package management

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

## Development

### Frontend
- Built with React and Vite
- Styled with styled-components
- Located in `frontend/`

### Backend
- Python Flask API
- Package management with uv
- Located in `backend/`

## Scripts

- `npm run dev` - Start both frontend and backend in development mode
- `npm run dev:frontend` - Start only frontend
- `npm run dev:backend` - Start only backend
- `npm run build` - Build frontend for production
- `npm run install:all` - Install all dependencies

## License

MIT
