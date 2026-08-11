# Real-Time Chat App

A full-stack, event-driven real-time chat application featuring live online presence, read receipts, and relative timestamps. 

## 🔗 Live Demo & Walkthrough
- **Live App:** [https://YOUR-VERCEL-APP-URL.vercel.app](https://YOUR-VERCEL-APP-URL.vercel.app)
- **Demo Video:** [Watch the Walkthrough](https://youtube.com/your-video-link)

## ✨ Features
- **Real-Time Messaging:** Instant message delivery using WebSockets.
- **Online Presence:** See exactly who is online in a room, tracking connections and disconnections in real-time.
- **Read Receipts:** Know when users in the room have viewed your message with an elegant "Seen by" indicator.
- **Live Timestamps:** Auto-updating human-readable timestamps (e.g., "just now", "2m ago").
- **Smart UI Polish:** Loading states, empty room states, and smart auto-scrolling that respects user reading position.
- **Resilient Connection:** Graceful handling of socket reconnections and state restoration.

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite
- **UI Components:** Internal `@internal/ui-system` (Button, Input, and layout primitives)
- **Icons:** Lucide React
- **Backend:** Node.js, Express
- **Database:** MongoDB, Mongoose
- **Real-Time Engine:** Socket.io

## 🏗️ Architecture Notes
The application operates on an event-driven architecture using Socket.io to establish persistent WebSocket connections between the client and the server.
- **State Management:** The backend acts as the source of truth for presence, using the `socket.data` property to store `username` and `room` bindings per connection. 
- **Broadcasts:** Events like `roomUsers` and `messageUpdated` are scoped and broadcast explicitly to specific socket rooms, minimizing unnecessary network overhead.
- **Read Receipts:** Handled efficiently via Intersection Observers (or focus events) on the client, which emit a `markAsRead` payload to update the `readBy` array in the MongoDB `Message` document before broadcasting the update back to the room.

## 🚀 Running Locally

### Backend
1. `cd backend`
2. Create a `.env` file with `MONGODB_URI=mongodb://127.0.0.1:27017/chat-app`
3. Run `npm install` and `npm start`

### Frontend
1. `cd frontend`
2. Create a `.env` file with `VITE_SERVER_URL=http://localhost:3002`
3. Run `npm install` and `npm run dev`
