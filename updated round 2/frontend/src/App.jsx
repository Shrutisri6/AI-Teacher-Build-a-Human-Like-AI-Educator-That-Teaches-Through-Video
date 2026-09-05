import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import StudentProfile from './pages/StudentProfile';
import SetupLesson from './pages/SetupLesson';
import LessonPlanner from './pages/LessonPlanner';
import TeachingScreen from './pages/TeachingScreen';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/setup" element={<SetupLesson />} />
          <Route path="/plan" element={<LessonPlanner />} />
          <Route path="/teach" element={<TeachingScreen />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
