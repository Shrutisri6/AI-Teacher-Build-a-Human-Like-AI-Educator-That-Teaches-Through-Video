import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp, AlertTriangle, Play, BookOpen, Clock, Target } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();
  
  const [stats, setStats] = useState({
    score: 0,
    completed: 0,
    timeSpent: '0m'
  });
  
  const [strongConcepts, setStrongConcepts] = useState([]);
  const [weakConcepts, setWeakConcepts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const studentId = localStorage.getItem('studentId') || 1;
        const { api } = await import('../api');
        const data = await api.getDashboardStats(studentId);
        
        if (data.stats) {
          setStats(data.stats);
          setStrongConcepts(data.strongConcepts || []);
          setWeakConcepts(data.weakConcepts || []);
        }
      } catch (error) {
        console.error("Failed to load dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h1 className="text-4xl font-bold mb-2">Welcome back, Student</h1>
            <p className="text-muted-foreground text-lg">Here's your learning progress</p>
          </div>
          <button 
            onClick={() => navigate('/setup')}
            className="px-6 py-3 bg-primary text-white rounded-xl font-medium hover:bg-primary/90 transition-all flex items-center gap-2"
          >
            <Play className="w-4 h-4 fill-white" /> Start New Lesson
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-green-500/10 text-green-500 flex items-center justify-center">
              <Trophy className="w-8 h-8" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Average Score</p>
              <p className="text-3xl font-bold">{stats.score}%</p>
            </div>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
              <BookOpen className="w-8 h-8" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Topics Completed</p>
              <p className="text-3xl font-bold">{stats.completed}</p>
            </div>
          </div>
          <div className="bg-card border border-border p-6 rounded-3xl shadow-sm flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <p className="text-muted-foreground text-sm font-medium mb-1">Time Learning</p>
              <p className="text-3xl font-bold">{stats.timeSpent}</p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-10">
          <div className="bg-card border border-border rounded-3xl p-8">
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-500" /> Strong Areas
            </h3>
            <div className="space-y-4">
              {strongConcepts.map(concept => (
                <div key={concept} className="flex justify-between items-center p-4 bg-secondary rounded-xl">
                  <span className="font-medium">{concept}</span>
                  <span className="text-green-500 font-medium">95%</span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-card border border-border rounded-3xl p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-destructive/5 rounded-full blur-3xl"></div>
            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-destructive" /> Needs Improvement
            </h3>
            <div className="space-y-4">
              {weakConcepts.map(concept => (
                <div key={concept} className="flex justify-between items-center p-4 bg-secondary rounded-xl">
                  <span className="font-medium">{concept}</span>
                  <span className="text-destructive font-medium">45%</span>
                </div>
              ))}
            </div>
            <div className="mt-6 p-4 bg-primary/10 rounded-xl border border-primary/20 flex gap-4 items-start">
              <Target className="w-6 h-6 text-primary shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-primary mb-1">Recommended Action</h4>
                <p className="text-sm text-foreground/80">Revise Ohm's Law and complete 2 additional practice problems. Would you like to start a quick revision session?</p>
                <button className="mt-3 text-sm font-medium text-white bg-primary px-4 py-2 rounded-lg hover:bg-primary/90">
                  Start Revision
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
