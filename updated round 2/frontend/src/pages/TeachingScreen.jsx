import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Send, MessageSquare, List, ChevronRight, Activity } from 'lucide-react';

export default function TeachingScreen() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState('');
  const [lessonPlan, setLessonPlan] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [currentConceptIndex, setCurrentConceptIndex] = useState(0);
  const [understandingScore, setUnderstandingScore] = useState(85);
  const [avatarVideo, setAvatarVideo] = useState("https://assets.mixkit.co/videos/preview/mixkit-young-woman-talking-on-video-call-40114-large.mp4");
  const chatEndRef = useRef(null);

  useEffect(() => {
    const currentTopic = localStorage.getItem('currentTopic') || 'Artificial Intelligence';
    setTopic(currentTopic);
    
    try {
      const plan = JSON.parse(localStorage.getItem('lessonPlan'));
      if (plan) setLessonPlan(plan);
    } catch (e) {
      console.error("Failed to parse lesson plan", e);
    }
    
    // Initial Teacher Message
    setTimeout(() => {
      setChatHistory([
        {
          role: 'teacher',
          text: `Hello! Today we are going to learn about ${currentTopic}. I'll break this down into simple concepts. Let's start with the basics. What do you already know about it?`,
          isEvaluating: false
        }
      ]);
      setIsSpeaking(true);
      setTimeout(() => setIsSpeaking(false), 3000);
    }, 1000);
  }, []);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatHistory]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    // Add student message
    const newHistory = [...chatHistory, { role: 'student', text: userText }];
    setChatHistory(newHistory);
    setInputText('');
    
    try {
      const studentId = localStorage.getItem('studentId') || 1;
      const { api } = await import('../api');
      
      const response = await api.chatInteraction({
        student_id: parseInt(studentId, 10),
        concept: lessonPlan?.sections?.[currentConceptIndex]?.title || 'Introduction',
        action: 'evaluate', // Using evaluate for user input
        student_answer: userText,
        question: chatHistory[chatHistory.length - 1]?.text || ''
      });
      
      setChatHistory(prev => [...prev, {
        role: 'teacher',
        text: response.text || response.feedback || "Good job!",
        isEvaluating: true,
        isCorrect: response.is_correct
      }]);
      setUnderstandingScore(Math.round(response.new_score || 85));
      if (response.avatar_video && response.avatar_video !== "https://mock_video_url_from_heygen.mp4") {
        setAvatarVideo(response.avatar_video);
      }
      
      setIsSpeaking(true);
      // Play audio if provided (placeholder implementation)
      if (response.speech_audio) {
         // const audio = new Audio("data:audio/mp3;base64," + response.speech_audio);
         // audio.play();
      }
      setTimeout(() => setIsSpeaking(false), 4000);
    } catch (err) {
      console.error(err);
      setChatHistory(prev => [...prev, {
        role: 'teacher',
        text: "I'm having trouble connecting to my brain right now. Can you try again?",
        isEvaluating: false
      }]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col md:flex-row overflow-hidden">
      
      {/* LEFT: AI Avatar Column */}
      <div className="w-full md:w-1/4 bg-card border-r border-border p-6 flex flex-col flex-shrink-0 z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
          <span className="font-medium text-sm">EduVision Teacher Active</span>
        </div>
        
        {/* Mock Avatar Container */}
        <div className={`relative rounded-3xl overflow-hidden bg-secondary aspect-[3/4] border-4 transition-all duration-500 ${isSpeaking ? 'border-primary shadow-[0_0_30px_rgba(124,58,237,0.3)]' : 'border-transparent'}`}>
          <video 
            src={avatarVideo}
            autoPlay
            loop
            muted={!isSpeaking}
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Speaking Indicator Overlay */}
          <AnimatePresence>
            {isSpeaking && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full"
              >
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{ height: [8, 20, 8] }}
                    transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.1 }}
                    className="w-1 bg-primary rounded-full"
                  ></motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 bg-secondary/50 rounded-2xl p-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium">Understanding Score</span>
            <span className="text-sm font-bold text-primary">{understandingScore}%</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${understandingScore}%` }}
              transition={{ duration: 1 }}
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
            <Activity className="w-3 h-3" /> Adapting to your level...
          </p>
        </div>
      </div>

      {/* CENTER: Visuals & Chat */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-background relative">
        
        {/* Visual Explanation Area (Top Half) */}
        <div className="h-1/2 p-6 border-b border-border flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-lg flex items-center gap-2">
              <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-xs">Concept</span>
              {lessonPlan?.sections?.[currentConceptIndex]?.title || 'Concept'}
            </h2>
            <button 
              onClick={() => navigate('/dashboard')}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              End Lesson
            </button>
          </div>
          
          <div className="flex-1 bg-card rounded-3xl border border-border flex items-center justify-center p-8 relative overflow-hidden group">
            {/* Mock Visual representation - in reality this would be a dynamic component rendering math/code/diagrams */}
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
            
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              key={currentConceptIndex}
              className="z-10 text-center"
            >
              <div className="text-4xl md:text-5xl mb-6 bg-clip-text text-transparent bg-gradient-to-br from-primary to-blue-500 font-mono font-bold tracking-tighter px-4 max-w-2xl mx-auto">
                {lessonPlan?.sections?.[currentConceptIndex]?.title || 'Loading...'}
              </div>
              <p className="text-xl text-foreground font-medium bg-background/50 px-4 py-2 rounded-lg backdrop-blur-sm inline-block">
                {topic.replace("Document: ", "")}
              </p>
            </motion.div>
          </div>
        </div>

        {/* Chat Interface (Bottom Half) */}
        <div className="h-1/2 flex flex-col bg-secondary/20">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {chatHistory.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.role === 'student' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-[80%] rounded-3xl p-5 ${
                  msg.role === 'student' 
                    ? 'bg-primary text-white rounded-tr-sm shadow-md' 
                    : 'bg-card border border-border text-foreground rounded-tl-sm shadow-sm'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                  
                  {msg.isEvaluating && (
                    <div className="mt-4 pt-4 border-t border-border/50 flex gap-2">
                      <button className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">Explain again</button>
                      <button className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-full hover:bg-primary/20 transition-colors">Give example</button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
            <div ref={chatEndRef} />
          </div>
          
          <div className="p-6 bg-background border-t border-border">
            <form onSubmit={handleSend} className="relative flex items-center">
              <button type="button" className="absolute left-4 p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary rounded-full">
                <Mic className="w-5 h-5" />
              </button>
              <input 
                type="text" 
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask a question or answer the teacher..."
                className="w-full bg-card border border-border rounded-full py-4 pl-16 pr-16 outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
              />
              <button 
                type="submit" 
                disabled={!inputText.trim()}
                className="absolute right-4 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:bg-muted"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* RIGHT: Outline Column (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/5 bg-card border-l border-border p-6 flex-col flex-shrink-0 overflow-y-auto">
        <h3 className="font-semibold flex items-center gap-2 mb-6">
          <List className="w-5 h-5" /> Lesson Outline
        </h3>
        
        <div className="space-y-4">
          {(lessonPlan?.sections || []).map((section, idx) => {
            const isCompleted = idx < currentConceptIndex;
            const isCurrent = idx === currentConceptIndex;
            return (
              <div 
                key={idx} 
                className="flex items-start gap-3 cursor-pointer p-2 -mx-2 rounded-lg transition-colors hover:bg-secondary/50"
                onClick={() => setCurrentConceptIndex(idx)}
              >
                <div className={`mt-1 flex-shrink-0 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                  isCompleted ? 'bg-primary border-primary' : 
                  isCurrent ? 'border-primary' : 'border-muted'
                }`}>
                  {isCurrent && <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>}
                </div>
                <div className={`${
                  isCompleted ? 'text-muted-foreground line-through decoration-muted-foreground/30' :
                  isCurrent ? 'text-foreground font-medium' : 'text-muted-foreground'
                }`}>
                  {section.title}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
