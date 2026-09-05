import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Clock, Play, BookOpen, Layers } from 'lucide-react';

export default function LessonPlanner() {
  const navigate = useNavigate();
  const [lessonPlan, setLessonPlan] = useState(null);
  const [topic, setTopic] = useState('');

  useEffect(() => {
    const currentTopic = localStorage.getItem('currentTopic') || 'Artificial Intelligence';
    setTopic(currentTopic);
    
    const storedPlan = localStorage.getItem('lessonPlan');
    if (storedPlan) {
      try {
        const parsed = JSON.parse(storedPlan);
        // Ensure totalTime exists or calculate it
        const totalTime = parsed.sections ? parsed.sections.reduce((acc, s) => acc + (s.duration || 0), 0) : 0;
        setLessonPlan({
          ...parsed,
          totalTime: parsed.totalTime || totalTime,
        });
      } catch (err) {
        console.error('Failed to parse lesson plan', err);
      }
    } else {
      // Fallback or handle missing plan
      navigate('/setup');
    }
  }, [navigate]);

  if (!lessonPlan) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6"></div>
        <h2 className="text-2xl font-semibold">AI is crafting your lesson...</h2>
        <p className="text-muted-foreground mt-2">Analyzing {topic}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-16 px-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 text-primary mb-6">
          <BookOpen className="w-6 h-6" />
          <span className="font-semibold tracking-wider uppercase text-sm">Your AI Lesson Plan</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-bold mb-6">{lessonPlan.title}</h1>
        
        <div className="flex items-center gap-6 mb-12 border-b border-border pb-8">
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium">
            <Clock className="w-4 h-4 text-muted-foreground" />
            {lessonPlan.totalTime} mins optimized
          </div>
          <div className="flex items-center gap-2 bg-secondary px-4 py-2 rounded-full text-sm font-medium">
            <Layers className="w-4 h-4 text-muted-foreground" />
            {lessonPlan.sections.length} sections
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-12">
          <div className="md:col-span-2">
            <h3 className="text-xl font-semibold mb-6">Lesson Journey</h3>
            <div className="relative border-l-2 border-border ml-4 space-y-8 pb-4">
              {lessonPlan.sections && lessonPlan.sections.map((section, idx) => (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="relative pl-8"
                >
                  <div className="absolute w-4 h-4 bg-background border-2 border-primary rounded-full -left-[9px] top-1"></div>
                  <div className="bg-card border border-border p-5 rounded-2xl shadow-sm hover:border-primary/30 transition-colors">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-semibold text-lg">{section.title}</h4>
                      <span className="text-xs font-medium bg-secondary text-muted-foreground px-2 py-1 rounded-md">
                        {section.duration}m
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground capitalize">Type: {section.content_type || section.type || 'concept'}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <div className="bg-card border border-border rounded-3xl p-6 sticky top-8">
              <h3 className="font-semibold text-lg mb-4">Learning Objectives</h3>
              <ul className="space-y-4 mb-8">
                {lessonPlan.objectives.map((obj, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{obj}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => navigate('/teach')}
                className="w-full py-4 rounded-xl bg-primary text-white font-medium flex justify-center items-center gap-2 hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)]"
              >
                <Play className="w-5 h-5 fill-white" /> Start Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
