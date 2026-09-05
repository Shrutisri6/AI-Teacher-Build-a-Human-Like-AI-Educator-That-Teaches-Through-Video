import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User, Settings, Clock, BookOpen, Brain, Languages } from 'lucide-react';

export default function StudentProfile() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    level: 'Beginner',
    language: 'English',
    objective: '',
    teachingStyle: 'Visual',
    availableTime: 20
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { api } = await import('../api');
      const data = await api.createProfile({
        name: formData.name,
        level: formData.level,
        language: formData.language,
        objective: formData.objective,
        teaching_style: formData.teachingStyle,
        available_time: parseInt(formData.availableTime, 10)
      });
      localStorage.setItem('studentId', data.student_id);
      navigate('/setup');
    } catch (err) {
      setError(err.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden"
        >
          {/* Subtle gradient accent */}
          <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-primary via-purple-500 to-primary"></div>
          
          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold mb-3">Tell us about yourself</h1>
            <p className="text-muted-foreground">We'll personalize your learning experience based on this profile.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <User className="w-4 h-4 text-primary" /> Your Name
              </label>
              <input
                required
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="E.g. Alex"
                className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Brain className="w-4 h-4 text-primary" /> Current Knowledge Level
                </label>
                <select
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/50 appearance-none"
                >
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Languages className="w-4 h-4 text-primary" /> Preferred Language
                </label>
                <select
                  name="language"
                  value={formData.language}
                  onChange={handleChange}
                  className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/50 appearance-none"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Malayalam">Malayalam</option>
                  <option value="Telugu">Telugu</option>
                  <option value="Kannada">Kannada</option>
                  <option value="Hinglish">Hinglish</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Learning Objective
              </label>
              <input
                required
                name="objective"
                value={formData.objective}
                onChange={handleChange}
                placeholder="E.g. I want to build AI applications"
                className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/50"
              />
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Settings className="w-4 h-4 text-primary" /> Teaching Style
                </label>
                <select
                  name="teachingStyle"
                  value={formData.teachingStyle}
                  onChange={handleChange}
                  className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/50 appearance-none"
                >
                  <option value="Visual">Visual & Diagrammatic</option>
                  <option value="Theoretical">Theoretical & Detailed</option>
                  <option value="Practical">Practical & Code-focused</option>
                  <option value="Socratic">Socratic (Question-based)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" /> Available Time (mins)
                </label>
                <input
                  required
                  type="number"
                  min="5"
                  max="120"
                  name="availableTime"
                  value={formData.availableTime}
                  onChange={handleChange}
                  className="w-full bg-secondary text-foreground rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/50"
                />
              </div>
            </div>

            <div className="pt-6">
              {error && <p className="text-destructive text-sm mb-4 text-center">{error}</p>}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-xl bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] disabled:opacity-70 flex justify-center items-center gap-2"
              >
                {loading ? 'Creating Profile...' : 'Continue to Lesson Setup'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
