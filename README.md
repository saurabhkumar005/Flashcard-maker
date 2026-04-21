# FlashCard Maker

Full-stack MERN MVP that converts PDFs into AI-generated flashcard decks with spaced repetition controls.
🧠 The Flashcard Maker: AI-Powered Active Recall
The Flashcard Engine is a full-stack MERN application that bridges the gap between passive reading and active learning. By leveraging the Gemini 1.5 Flash AI, the engine transforms static PDF documents into intelligent, concept-heavy study decks designed for long-term retention via Spaced Repetition logic.

🚀 Deployment Links
Live Application: studycardfrompdf.vercel.app

Source Code: github.com/saurabhkumar005/Flashcard-maker

# 📽️ Project Note: Decisions & Trade-offs
This project was built within a 24-hour sprint for the Cuemath AI Builder Challenge. Below is the engineering rationale behind the core architecture.

**Smart Choices & Engineering Logic**
AI Model (Gemini 1.5 Flash): I chose Gemini 1.5 Flash over larger models for its superior speed-to-accuracy ratio. In a learning environment, low latency is critical to maintain user engagement during the "Generation" phase.

The "Teacher Persona" Prompt: Instead of simple definitions, I implemented a custom "High-Quality Teacher" system prompt. It instructs the AI to identify edge cases and worked examples within the PDF text, ensuring cards challenge the user's deep understanding rather than just rote memory.

Spaced Repetition (Leitner Logic): I implemented a manual Leitner-style mastery system. Users categorize cards into "Still Learning," "Almost There," or "Mastered," which updates the deck's aggregate mastery percentage. This provides immediate visual feedback on learning progress.

Security-First Architecture: All AI orchestration happens on the Backend. By using a Node/Express proxy, I ensured that sensitive API keys are never exposed to the client-side browser, meeting professional security standards.

**Strategic Trade-offs**
Memory-Based PDF Processing: I utilized multer memory storage for PDF ingestion.

Trade-off: While this limits the file size compared to disk storage or S3, it significantly increased processing speed and simplified the deployment pipeline on Render for this MVP.

Minimalist UI vs. Feature Density: I prioritized a "Distraction-Free" study interface. While I could have added more UI bells and whistles, I focused on the core Card Flip Animation (via Framer Motion) to ensure the primary study action felt tactile and delightful.

**Future Roadmap** 
If I had more time to evolve this project:

Voice-First Mode: Implementing Web Speech APIs to allow students to "speak" their answers, which the AI would then evaluate for conceptual accuracy.

Automated Spaced Repetition: Moving from manual buttons to a timestamp-based "Review Queue" that notifies users exactly when their memory of a specific deck is likely to fade.

JWT Authentication: Adding a secure user layer to allow multiple students to maintain separate, private mastery dashboards.

🛠️ Tech Stack
Frontend: React (Vite), Tailwind CSS, Framer Motion

Backend: Node.js, Express.js

Database: MongoDB Atlas

AI: Google Gemini 1.5 Flash API

Hosting: Vercel (Frontend), Render (Backend)

💻 Local Setup Instructions
Prerequisites
Node.js (v18+)

MongoDB Atlas Account

Google AI Studio API Key (Gemini)

**Backend Setup**
Bash
cd server
npm install
# Create a .env file in the server folder:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
GEMINI_API_KEY=your_gemini_key
CLIENT_URL=http://localhost:5173
Run the server: node server.js

**Frontend Setup**
Bash
cd client
npm install
# Create a .env file in the client folder:
VITE_API_BASE_URL=http://localhost:5000
Run the client: npm run dev

Developed with ❤️ by Saurabh Kumar
