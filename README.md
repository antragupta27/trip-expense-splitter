# Trip Expense Splitter

A MERN stack portfolio project for managing trips, members, shared expenses, and settlement balances.

## Stack

- MongoDB
- Express.js
- React
- Node.js

## Project structure

- `frontend/` – React app with Vite
- `backend/` – Express API skeleton ready for MongoDB Atlas later

## Frontend

```bash
cd frontend
npm install
npm run dev
```

## Backend

```bash
cd backend
npm install
npm run dev
```

## Environment

Copy `.env.example` to `.env` in the project root and update values as needed.

## Notes

- MongoDB is not connected yet.
- The app uses temporary mock data for the initial UI.
- The API and Mongoose models are structured so MongoDB can be connected later through `MONGO_URI`.
