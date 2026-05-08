// src/pages/Lesson.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Check, X } from 'lucide-react';
import NaviMascot from '../components/NaviMascot';

const Lesson = ({ userData }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [completed, setCompleted] = useState(false);

  const lessonContent = {
    title: 'Introduction to Fundamentals',
    steps: [
      {
        type: 'text',
        title: 'Welcome to Your Journey',
        content: 'In this intensive lesson, you will learn the core fundamentals that will set the foundation for your career success. Let\'s dive in!'
      },
      {
        type: 'quiz',
        title: 'Quick Check',
        question: 'What is the most important aspect of learning?',
        options: ['Practice', 'Theory', 'Networking', 'Resources'],
        correct: 0
      },
      {
        type: 'text',
        title: 'Key Concepts',
        content: 'Understanding the fundamentals requires dedication and consistent practice. Remember, mastery comes from repetition and application.'
      },
      {
        type: 'exercise',
        title: 'Your First Challenge',
        content: 'Apply what you\'ve learned by completing the practical exercise below.'
      }
    ]
  };

  const handleNext = () => {
    if (currentStep < lessonContent.steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setCompleted(true);
    }
  };

  if (completed) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white rounded-3xl shadow-xl p-12 text-center max-w-lg"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
            className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <Check className="w-12 h-12 text-white" strokeWidth={3} />
          </motion.div>
          
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Lesson Complete! 🎉
          </h2>
          <p className="text-slate-600 mb-8">
            Great job! You've taken an important step in your career journey. Keep up the momentum!
          </p>
          
          <div className="flex gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 bg-slate-200 text-slate-800 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
            >
              Back to Dashboard
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="flex-1 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
            >
              Continue Learning
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const currentContent = lessonContent.steps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          
          <div className="flex items-center gap-3">
            <NaviMascot size={32} animated={true} />
            <span className="font-semibold text-slate-800">
              {currentStep + 1} / {lessonContent.steps.length}
            </span>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-slate-200">
          <motion.div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
            initial={{ width: 0 }}
            animate={{ width: `${((currentStep + 1) / lessonContent.steps.length) * 100}%` }}
          />
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 py-12">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          className="bg-white rounded-3xl shadow-xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold text-slate-800 mb-6">
            {currentContent.title}
          </h2>
          
          <div className="prose prose-lg max-w-none mb-8">
            <p className="text-slate-600 text-lg leading-relaxed">
              {currentContent.content}
            </p>
          </div>

          {currentContent.type === 'quiz' && (
            <div className="space-y-3 mt-8">
              {currentContent.options.map((option, index) => (
                <button
                  key={index}
                  className="w-full p-4 text-left rounded-xl border-2 border-slate-200 hover:border-indigo-500 hover:bg-indigo-50 transition-all"
                >
                  {option}
                </button>
              ))}
            </div>
          )}

          <div className="mt-12 flex justify-end">
            <button
              onClick={handleNext}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-105 transition-all"
            >
              {currentStep < lessonContent.steps.length - 1 ? 'Continue' : 'Complete Lesson'}
            </button>
          </div>
        </motion.div>
      </main>

      {/* Navi Helper */}
      <motion.div
        className="fixed bottom-6 left-6 bg-white rounded-2xl shadow-lg p-4 max-w-xs"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-start gap-3">
          <NaviMascot size={40} animated={true} />
          <div>
            <p className="text-sm font-semibold text-slate-800 mb-1">Navi says:</p>
            <p className="text-sm text-slate-600">
              {currentStep === 0 ? "Let's start your learning journey!" : 
               currentStep === lessonContent.steps.length - 1 ? "Almost there! You've got this!" :
               "Great progress! Keep going!"}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Lesson;