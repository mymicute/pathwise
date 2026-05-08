// src/pages/SignUp.jsx
import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NaviMascot from '../components/NaviMascot';
import TriviaQuestion from '../components/TriviaQuestion';

const triviaQuestions = [
  {
    id: 1,
    question: "What excites you most about your chosen career?",
    options: [
      "Solving complex problems",
      "Creating beautiful designs",
      "Helping people directly",
      "Making money and impact"
    ],
    icon: "🎯"
  },
  {
    id: 2,
    question: "How do you prefer to learn?",
    options: [
      "Hands-on projects",
      "Reading and research",
      "Video tutorials",
      "Collaborative learning"
    ],
    icon: "📚"
  },
  {
    id: 3,
    question: "What's your current experience level?",
    options: [
      "Complete beginner",
      "Some knowledge",
      "Intermediate",
      "Advanced - want to specialize"
    ],
    icon: "📊"
  },
  {
    id: 4,
    question: "How much time can you dedicate daily?",
    options: [
      "30 minutes",
      "1 hour",
      "2-3 hours",
      "Full day immersion"
    ],
    icon: "⏰"
  },
  {
    id: 5,
    question: "What's your ultimate career goal?",
    options: [
      "Get my first job",
      "Switch careers",
      "Start my own business",
      "Become an expert/leader"
    ],
    icon: "🏆"
  }
];

const SignUp = ({ userData, setUserData }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [userName, setUserName] = useState('');
  const [step, setStep] = useState('name'); // 'name', 'trivia', 'complete'

  const selectedCareer = location.state?.selectedCareer;

  const handleNameSubmit = (e) => {
    e.preventDefault();
    if (userName.trim()) {
      setUserData({ ...userData, userName });
      setStep('trivia');
    }
  };

  const handleAnswer = (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < triviaQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setUserData({ 
        ...userData, 
        userName,
        triviaAnswers: newAnswers,
        selectedCareer,
        userLevel: newAnswers[2] || 'beginner'
      });
      setStep('complete');
    }
  };

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <NaviMascot size={80} animated={true} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Welcome to PathWise!
          </h1>
          <p className="text-slate-600">
            {step === 'name' && "Let's get to know you"}
            {step === 'trivia' && "Help us personalize your learning path"}
            {step === 'complete' && "You're all set!"}
          </p>
        </motion.div>

        {/* Progress Bar */}
        {step === 'trivia' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-8"
          >
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500"
                initial={{ width: 0 }}
                animate={{ width: `${((currentQuestion + 1) / triviaQuestions.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>
            <p className="text-center text-sm text-slate-600 mt-2">
              Question {currentQuestion + 1} of {triviaQuestions.length}
            </p>
          </motion.div>
        )}

        {/* Content */}
        <AnimatePresence mode="wait">
          {step === 'name' && (
            <motion.div
              key="name"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              {selectedCareer && (
                <div className="mb-6 p-4 bg-indigo-50 rounded-xl">
                  <p className="text-sm text-indigo-600 font-semibold">
                    Selected Career: {selectedCareer.title}
                  </p>
                </div>
              )}
              
              <form onSubmit={handleNameSubmit}>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  What should we call you?
                </label>
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Enter your name"
                  autoFocus
                />
                <button
                  type="submit"
                  className="mt-6 w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
                >
                  Continue
                </button>
              </form>
            </motion.div>
          )}

          {step === 'trivia' && (
            <TriviaQuestion
              question={triviaQuestions[currentQuestion]}
              onAnswer={handleAnswer}
            />
          )}

          {step === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl shadow-xl p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.2 }}
                className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </motion.div>
              
              <h2 className="text-2xl font-bold text-slate-800 mb-2">
                Perfect, {userName}! 🎉
              </h2>
              <p className="text-slate-600 mb-6">
                Your personalized learning path is ready. Let's begin your journey to mastering {selectedCareer?.title || 'your career'}!
              </p>
              
              <button
                onClick={handleComplete}
                className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transform hover:scale-[1.02] transition-all"
              >
                Start Learning
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SignUp;