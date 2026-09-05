import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Upload, FileText, Search, ArrowRight, Loader2 } from 'lucide-react';

export default function SetupLesson() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('topic'); // 'topic' or 'upload'
  const [topic, setTopic] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const handleTopicSubmit = async (e) => {
    e.preventDefault();
    if (!topic.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const studentId = localStorage.getItem('studentId') || 1;
      const { api } = await import('../api');
      const data = await api.generateLesson(topic, parseInt(studentId, 10));
      localStorage.setItem('currentTopic', topic);
      localStorage.setItem('lessonPlan', JSON.stringify(data.lesson_plan));
      navigate('/plan');
    } catch (err) {
      setError(err.message || 'Failed to generate lesson plan');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) setFile(selectedFile);
  };

  const handleFileSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;
    
    setLoading(true);
    setError(null);
    try {
      const { api } = await import('../api');
      const data = await api.uploadDocument(file);
      
      const studentId = localStorage.getItem('studentId') || 1;
      const lessonData = await api.generateLesson(`Document: ${file.name}`, parseInt(studentId, 10));
      
      localStorage.setItem('currentTopic', `Document: ${file.name}`);
      localStorage.setItem('lessonPlan', JSON.stringify(lessonData.lesson_plan));
      navigate('/plan');
    } catch (err) {
      setError(err.message || 'Failed to process document');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-20 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">What do you want to learn today?</h1>
          <p className="text-muted-foreground text-lg">Choose a topic or upload your study material.</p>
          {error && <p className="text-destructive font-medium mt-4">{error}</p>}
        </motion.div>

        <div className="bg-card border border-border rounded-3xl p-2 mb-8 shadow-sm flex relative">
          <div 
            className="absolute h-full w-1/2 bg-secondary rounded-2xl transition-transform duration-300 ease-in-out -z-10"
            style={{ transform: activeTab === 'upload' ? 'translateX(100%)' : 'translateX(0)' }}
          />
          <button
            onClick={() => setActiveTab('topic')}
            className={`w-1/2 py-4 rounded-2xl font-medium flex justify-center items-center gap-2 transition-colors ${activeTab === 'topic' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Search className="w-5 h-5" /> Enter Topic
          </button>
          <button
            onClick={() => setActiveTab('upload')}
            className={`w-1/2 py-4 rounded-2xl font-medium flex justify-center items-center gap-2 transition-colors ${activeTab === 'upload' ? 'text-foreground' : 'text-muted-foreground'}`}
          >
            <Upload className="w-5 h-5" /> Upload Material
          </button>
        </div>

        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: activeTab === 'topic' ? -20 : 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-card border border-border rounded-3xl p-8 md:p-12 shadow-xl"
        >
          {activeTab === 'topic' ? (
            <form onSubmit={handleTopicSubmit} className="space-y-6">
              <div className="space-y-4">
                <label className="text-lg font-medium block">
                  I want to learn about...
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    placeholder="e.g. Artificial Intelligence, Ohm's Law, Cell Division"
                    className="w-full bg-secondary text-foreground rounded-2xl px-6 py-5 text-lg outline-none focus:ring-2 focus:ring-primary/50 transition-all border border-transparent focus:border-primary/50 pr-16"
                  />
                  <div className="absolute right-4 top-1/2 -translate-y-1/2">
                    <Search className="w-6 h-6 text-muted-foreground" />
                  </div>
                </div>
              </div>
              <button
                type="submit"
                disabled={!topic.trim() || loading}
                className="w-full py-5 rounded-2xl bg-primary text-white font-medium text-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Generate Lesson Plan'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleFileSubmit} className="space-y-6">
              <div 
                className="border-2 border-dashed border-primary/30 bg-primary/5 hover:bg-primary/10 rounded-3xl p-12 text-center transition-colors cursor-pointer relative"
                onClick={() => document.getElementById('file-upload').click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  className="hidden"
                  accept=".pdf,.docx,.pptx,.txt"
                  onChange={handleFileUpload}
                />
                
                {file ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-primary/20 text-primary rounded-full flex justify-center items-center">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <p className="font-medium text-lg">{file.name}</p>
                      <p className="text-sm text-muted-foreground">Ready to process</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-secondary text-muted-foreground rounded-full flex justify-center items-center mb-2">
                      <Upload className="w-8 h-8" />
                    </div>
                    <p className="font-medium text-lg">Click to browse or drag and drop</p>
                    <p className="text-sm text-muted-foreground">Supports PDF, DOCX, PPTX, TXT</p>
                  </div>
                )}
              </div>
              <button
                type="submit"
                disabled={!file || loading}
                className="w-full py-5 rounded-2xl bg-primary text-white font-medium text-lg hover:bg-primary/90 transition-all disabled:opacity-50 flex justify-center items-center gap-2"
              >
                {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : 'Analyze & Plan Lesson'}
                {!loading && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </div>
  );
}
