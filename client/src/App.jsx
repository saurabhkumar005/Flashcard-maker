import { Navigate, Route, Routes } from "react-router-dom";
import { motion } from "framer-motion";
import TopNav from "./components/TopNav";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import StudyPage from "./pages/StudyPage";
import AuthPage from "./pages/AuthPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <div className="relative min-h-screen overflow-hidden">
      <motion.div
        className="aurora-blob -left-20 top-24 h-72 w-72 bg-indigo-300/70"
        animate={{ x: [0, 20, -10, 0], y: [0, -20, 10, 0] }}
        transition={{ duration: 14, repeat: Infinity }}
      />
      <motion.div
        className="aurora-blob right-0 top-1/3 h-80 w-80 bg-emerald-300/60"
        animate={{ x: [0, -20, 15, 0], y: [0, 14, -12, 0] }}
        transition={{ duration: 16, repeat: Infinity }}
      />
      <motion.div
        className="aurora-blob bottom-0 left-1/3 h-72 w-72 bg-fuchsia-300/60"
        animate={{ x: [0, 16, -8, 0], y: [0, -14, 12, 0] }}
        transition={{ duration: 13, repeat: Infinity }}
      />
      <TopNav />
      <main className="relative z-10">
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/upload"
            element={
              <ProtectedRoute>
                <UploadPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/study/:deckId"
            element={
              <ProtectedRoute>
                <StudyPage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
