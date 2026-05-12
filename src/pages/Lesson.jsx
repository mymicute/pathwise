import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { lessons } from '../data/lessons';
import LessonViewer from '../components/LessonViewer';
import { ArrowLeft, Check } from 'lucide-react';
import NaviMascot from '../components/NaviMascot';

export default function Lesson() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [completed, setCompleted] = useState(false);

  const lesson = lessons.find(l => l.id === parseInt(id)) || lessons[0];

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }} className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">Lesson Complete! 🎉</h2>
          <p className="text-slate-600 mb-8">You've mastered <strong>{lesson.title}</strong>. Keep the momentum going!</p>
          <div className="flex gap-4">
            <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 bg-slate-200 text-slate-800 rounded-xl font-semibold hover:bg-slate-300 transition-colors">Dashboard</button>
            <button onClick={() => navigate('/dashboard')} className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all">Next Lesson</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium hidden sm:inline">Back to Dashboard</span>
          </button>
          <div className="flex items-center gap-3">
            <NaviMascot size={32} animated={true} />
            <span className="font-semibold text-slate-800">{lesson.title}</span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <LessonViewer lesson={lesson} onComplete={() => setCompleted(true)} />
      </main>
    </div>
  );
}