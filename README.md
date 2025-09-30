# Honeymoon Bridge 🃏

A real-time multiplayer implementation of the classic Honeymoon Bridge card game, built with modern web technologies and powered by Nx.

| ss1 | ss2 |
|---|---|
|<img width="678" height="1470" alt="Screenshot 2025-09-30 at 09 28 05" src="https://github.com/user-attachments/assets/dea07ee7-536f-445c-b09c-8598ad8dc207" />|<img width="678" height="1470" alt="Screenshot 2025-09-30 at 09 27 57" src="https://github.com/user-attachments/assets/1cfd52a5-24ef-4743-9fc0-14ac54181c93" />|

## 🎮 About the Game

Honeymoon Bridge is a simplified two-player variant of the classic Bridge card game. This implementation features:

- **Real-time multiplayer gameplay** using WebSockets
- **Complete game mechanics** including trump suit selection, trick-taking, and scoring
- **Interactive card table** with drag-and-drop card play
- **Responsive design** optimized for desktop and mobile devices
- **Game state management** with proper turn-based mechanics

## 🏗️ Architecture

This project is built as an Nx monorepo with two main packages:

### Backend (`packages/backend`)

- **Express.js** server with TypeScript
- **Socket.IO** for real-time communication
- **OpenAPI/Swagger** documentation
- **Zod** schemas for type-safe validation
- **Game engine** with complete Honeymoon Bridge logic

### Frontend (`packages/frontend`)

- **React 19** with TypeScript
- **TanStack Router** for client-side routing
- **Tailwind CSS** for styling
- **Vite** for development and building
- **Socket.IO Client** for real-time updates
- **Framer Motion** for card animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd honeymoon-bridge

# Install dependencies
npm install
```

### Development

Start both frontend and backend in development mode:

```bash
# Start backend (runs on http://localhost:3000)
npm run start:dev:be

# Start frontend (runs on http://localhost:5173)
npm run start:dev:fe
```

### API Documentation

Generate and update Swagger API documentation:

```bash
npm run generate:swagger
```

The API documentation will be available at `http://localhost:3000/api-docs` when the backend is running.

## 🎯 Game Features

### Core Gameplay

- **Two-player matches** with session-based authentication
- **Card dealing** with proper shuffling and distribution
- **Trump suit selection** by the active player
- **Trick-taking mechanics** with suit-following rules
- **Scoring system** based on traditional Honeymoon Bridge rules
- **Round progression** with proper game state management

### User Interface

- **Interactive card table** with visual card representations
- **Trump suit selector** with all four suits plus "no trump" option
- **Real-time game state updates**
- **Scoreboard** showing current and historical scores
- **Game lobby** for creating and joining games
- **Responsive design** for various screen sizes

### Technical Features

- **Type-safe API** with OpenAPI schema generation
- **Real-time synchronization** between players
- **Session management** for player authentication
- **Game state persistence** during active sessions
- **Comprehensive error handling** and validation

## 📁 Project Structure

```text
honeymoon-bridge/
├── packages/
│   ├── backend/                 # Express.js API server
│   │   ├── src/
│   │   │   ├── controllers/     # Request handlers
│   │   │   ├── models/          # Game entities (Card, Player, etc.)
│   │   │   ├── services/        # Business logic
│   │   │   ├── schemas/         # Zod validation schemas
│   │   │   └── routers/         # API routes
│   │   └── package.json
│   └── frontend/                # React application
│       ├── src/
│       │   ├── components/      # React components
│       │   ├── routes/          # TanStack Router pages
│       │   ├── hooks/           # Custom React hooks
│       │   ├── contexts/        # React contexts
│       │   └── network/         # API client
│       └── package.json
├── bin/                         # Utility scripts
└── package.json                 # Root package configuration
```

## 🛠️ Development Commands

```bash
# Build both packages
npm run build

# Run linting
npm run lint

# Run tests
npm run test

# Type checking
npm run typecheck

# Generate API types from OpenAPI schema
npm run generate:swagger
```

## 🧪 Testing

The project includes comprehensive test suites for both frontend and backend:

```bash
# Run backend tests
npx nx test backend

# Run frontend tests
npx nx test frontend

# Run all tests
npx nx run-many -t test
```

## 🚢 Deployment

### Production Build

```bash
# Build for production
npx nx build backend
npx nx build frontend
```

### Environment Variables

Configure the following environment variables for production:

```env
```env
# Backend
PORT=3000
NODE_ENV=production

# Frontend
VITE_API_URL=http://localhost:3000


## 🎮 How to Play

1. **Join a Game**: Navigate to the lobby and create or join a game
2. **Wait for Opponent**: Games require exactly 2 players to start
3. **Select Trump**: When it's your turn, choose a trump suit (or no trump)
4. **Play Cards**: Click on cards in your hand to play them
5. **Follow Suit**: You must follow the leading suit if you have cards of that suit
6. **Win Tricks**: The highest card (considering trump) wins each trick
7. **Score Points**: Points are awarded based on tricks won and trump selection
8. **Complete Rounds**: Play continues until all 26 tricks are played

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

---

Built with ❤️ using [Nx](https://nx.dev), [React](https://react.dev), [Express](https://expressjs.com), and [Socket.IO](https://socket.io)
