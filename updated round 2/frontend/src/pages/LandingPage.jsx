import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { BookOpen, BrainCircuit, Sparkles, Video } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob"></div>
        <div className="absolute top-[20%] right-[-5%] w-96 h-96 bg-purple-300/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-blue-300/20 rounded-full blur-3xl mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 glass border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BrainCircuit className="w-8 h-8 text-primary" />
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              EduVision AI
            </span>
          </div>
          <div className="hidden md:flex gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-primary transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">How it works</a>
          </div>
          <Link to="/profile">
            <button className="px-6 py-2.5 rounded-full bg-primary text-white font-medium hover:bg-primary/90 transition-all shadow-[0_0_20px_rgba(124,58,237,0.3)] hover:shadow-[0_0_25px_rgba(124,58,237,0.5)]">
              Start Learning
            </button>
          </Link>
        </div>
      </nav>

      <main className="pt-32 pb-16 px-6">
        <div className="max-w-7xl mx-auto text-center mt-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-8">
              <Sparkles className="w-4 h-4" />
              Not just a chatbot. A real teacher.
            </span>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-foreground mb-6">
              Meet Your Personal <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-600">
                AI Teacher
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
              Learn anything. At your level. In your language. At your pace. 
              Experience the future of personalized education with an AI that understands, teaches, and adapts to you.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/profile">
                <button className="px-8 py-4 rounded-full bg-primary text-white text-lg font-medium hover:bg-primary/90 transition-all shadow-[0_0_30px_rgba(124,58,237,0.4)] hover:shadow-[0_0_40px_rgba(124,58,237,0.6)] w-full sm:w-auto">
                  Start Learning Now
                </button>
              </Link>
              <Link to="/setup">
                <button className="px-8 py-4 rounded-full bg-card text-card-foreground border border-border text-lg font-medium hover:bg-secondary transition-all w-full sm:w-auto">
                  Upload Material
                </button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mt-24 grid md:grid-cols-3 gap-8 text-left"
          >
            {[
              {
                icon: <BrainCircuit className="w-6 h-6" />,
                title: 'Personalized Teaching',
                desc: 'Adapts to your current knowledge level and preferred learning style in real-time.'
              },
              {
                icon: <BookOpen className="w-6 h-6" />,
                title: 'Interactive Learning',
                desc: 'Periodic assessments, Q&A, and adaptive explanations to ensure true understanding.'
              },
              {
                icon: <Video className="w-6 h-6" />,
                title: 'AI-Powered Visuals',
                desc: 'Dynamic diagrams, equations, and code snippets generated specifically for your lesson.'
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 rounded-3xl glass hover:border-primary/30 transition-all group">
                <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </main>
    </div>
  );
}
