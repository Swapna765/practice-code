# Snip — URL shortener

A small URL-shortener project built with React, Express, and MongoDB. Anyone can shorten links. Signed-in users can choose custom endings and see their saved long/short URL pairs in account history. Guest links are not attached to an account. Destination URLs and short codes are stored so redirects continue to work.

## Run locally

You need Node.js and a MongoDB connection (a local MongoDB server or MongoDB Atlas).

1. In `Backend`, copy `.env.example` to `.env` and set `MONGO_URI` and a private `JWT_SECRET`.
2. In a terminal:

   ```powershell
   cd Backend
   npm install
   npm run dev
   ```

3. In a second terminal:

   ```powershell
   cd Frontend
   npm install
   npm run dev
   ```

4. Open the Vite URL shown in the second terminal (usually `http://localhost:5173`).

The frontend proxies API calls to the backend on port 3000. `APP_URL` in the backend environment must be the public base URL for short links (locally, `http://localhost:3000`).

## Try it out

- Shorten a URL without signing in.
- Create an account with an email and password of at least 8 characters.
- Sign in to save newly created links in your history and use custom endings.
- Open a short link to redirect to its original URL.

## Useful commands

- Backend: `npm test` and `npm start`
- Frontend: `npm run build` and `npm run lint`

The backend API also exposes `GET /api/health`.
