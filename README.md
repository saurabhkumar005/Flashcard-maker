# FlashCard Maker

Full-stack MERN MVP that converts PDFs into AI-generated flashcard decks with spaced repetition controls.

## Local setup

### 1) Backend

- Update values in `server/.env` only
- Add your real Gemini API key
- Start MongoDB locally or provide hosted `MONGODB_URI`

```bash
cd server
npm install
npm run dev
```

### 2) Frontend

- Update values in `client/.env` only

```bash
cd client
npm install
npm run dev
```

## Deployment

- Frontend: Vercel (`client`)
- Backend: Render (`server`)
- Set env vars on Render: `PORT`, `MONGODB_URI`, `GEMINI_API_KEY`, `CLIENT_URL`
- Set env var on Vercel: `VITE_API_BASE_URL`
