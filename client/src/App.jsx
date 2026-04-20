import { Navigate, Route, Routes } from "react-router-dom";
import TopNav from "./components/TopNav";
import DashboardPage from "./pages/DashboardPage";
import UploadPage from "./pages/UploadPage";
import StudyPage from "./pages/StudyPage";

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <TopNav />
      <main>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/study/:deckId" element={<StudyPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
