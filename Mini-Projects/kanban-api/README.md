# Kanban API

A simple Express backend for the Kanban Board project.

## Running the server

1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the server (development mode):
   ```sh
   npm run dev
   ```
   Or standard start:
   ```sh
   node src/index.js
   ```

## Endpoints

- `GET /cards` - List all cards
- `POST /cards` - Create a new card
- `PATCH /cards/:id` - Update a card
- `DELETE /cards/:id` - Delete a card

## Notes
- CORS is enabled.
- Data is stored in-memory, so it resets when the server restarts.
- Artificial delay (300-600ms) is added to all requests to simulate network latency.
