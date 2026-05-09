import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import NaviMascot from '../components/NaviMascot';
import TriviaQuestion from '../components/TriviaQuestion';

const triviaQuestions = [
  { 
    id: 1, 
    question: "What excites you most about your chosen career?", 
    options: ["Solving complex problems", "Creating beautiful designs", "Helping people directly", "Making money and impact"], 
    icon: "🎯" 
  },
  { 
    id: 2, 
    question: "How do you prefer to learn?", 
    options: ["Hands-on projects", "Reading and research", "Video tutorials", "Collaborative learning"], 
    icon: "📚" 
  },
  { 
    id: 3, 
    question: "What's your current experience level?", 
    options: ["Complete beginner", "Some knowledge", "Intermediate", "Advanced - want to specialize"], 
    icon: "📊" 
  },
  { 
    id: 4, 
    question: "How much time can you dedicate daily?", 
    options: ["30 minutes", "1 hour", "2-3 hours", "Full day immersion"], 
    icon: "⏰" 
  },
  { 
    id: 5, 
    question: "What's your ultimate career goal?", 
    options: ["Get my first job", "Switch careers", "Start my own business", "Become an expert/leader"], 
    icon: "🏆" 
  }
];

export default function SignUp() {
  const navigate = useNavigate();
  const location = useLocation();
  const { signup, loginWithGoogle, updateUserData } = useAuth();
  
  const [authMode, setAuthMode] = useState('signup'); // 'signup', 'login', or 'trivia'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userName, setUserName] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const selectedCareer = location.state?.selectedCareer;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    if (authMode === 'signup' && !userName) {
      setError('Please enter your name');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      if (authMode === 'signup') {
        // Sign Up flow
        await signup(email, password, userName);
        setAuthMode('trivia');
      } else {
        // Login flow
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Auth error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setError('This email is already registered. Please login instead.');
      } else if (err.code === 'auth/user-not-found') {
        setError('No account found with this email. Please sign up.');
      } else if (err.code === 'auth/wrong-password') {
        setError('Incorrect password. Please try again.');
      } else if (err.code === 'auth/invalid-credential') {
        setError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Invalid email address.');
      } else {
        setError(err.message || 'Authentication failed');
      }
    }
    setLoading(false);
  };

  const handleGoogleSignIn = async () => {
    setError('');
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate('/dashboard');
    } catch (err) {
      console.error('Google sign-in error:', err);
      if (err.code === 'auth/popup-closed-by-user') {
        setError('Sign-in popup was closed. Please try again.');
      } else if (err.code === 'auth/popup-blocked') {
        setError('Popup was blocked. Please allow popups for this site.');
      } else if (err.code === 'auth/account-exists-with-different-credential') {
        setError('An account already exists with this email. Please use email/password instead.');
      } else {
        setError('Google sign-in failed. Please try again.');
      }
    }
    setLoading(false);
  };

  const handleAnswer = async (answer) => {
    const newAnswers = { ...answers, [currentQuestion]: answer };
    setAnswers(newAnswers);

    if (currentQuestion < triviaQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(currentQuestion + 1), 300);
    } else {
      setLoading(true);
      try {
        await updateUserData({
          selectedCareer: selectedCareer?.title || 'General',
          triviaAnswers: newAnswers
        });
        navigate('/dashboard');
      } catch (err) {
        console.error('Error saving trivia:', err);
        setError('Failed to save profile');
      }
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        {/* Header with Navi */}
        <motion.div 
          initial={{ y: -50, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="text-center mb-8"
        >
          <div className="flex justify-center mb-4">
            <NaviMascot size={80} animated={true} />
          </div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            {authMode === 'trivia' ? "Let's personalize your path!" : "Welcome to PathWise!"}
          </h1>
          <p className="text-slate-600">
            {authMode === 'signup' && "Create your account to start learning"}
            {authMode === 'login' && "Sign in to continue your learning journey"}
            {authMode === 'trivia' && "Help us personalize your path"}
          </p>
        </motion.div>

        {/* Error Message */}
        {error && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl mb-6 text-sm text-center"
          >
            {error}
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {authMode === 'trivia' ? (
            // Trivia Questions
            <motion.div
              key="trivia"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
            >
              <TriviaQuestion question={triviaQuestions[currentQuestion]} onAnswer={handleAnswer} />
            </motion.div>
          ) : (
            // Auth Form with Toggle
            <motion.div
              key="auth"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-xl p-8"
            >
              {/* Toggle Switch */}
              <div className="flex justify-center mb-8">
                <div className="bg-slate-100 rounded-full p-1 flex relative">
                  <motion.div
                    className="absolute top-1 bottom-1 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 shadow-md"
                    initial={false}
                    animate={{
                      x: authMode === 'signup' ? 0 : 100,
                      width: 'calc(50% - 4px)'
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                  <button
                    onClick={() => {
                      setAuthMode('signup');
                      setError('');
                    }}
                    className={`relative z-10 px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                      authMode === 'signup' ? 'text-white' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Sign Up
                  </button>
                  <button
                    onClick={() => {
                      setAuthMode('login');
                      setError('');
                    }}
                    className={`relative z-10 px-8 py-2 rounded-full text-sm font-semibold transition-colors duration-200 ${
                      authMode === 'login' ? 'text-white' : 'text-slate-600 hover:text-slate-800'
                    }`}
                  >
                    Log In
                  </button>
                </div>
              </div>

              {/* Selected Career Display */}
              {selectedCareer && authMode === 'signup' && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 bg-indigo-50 border border-indigo-100 rounded-xl"
                >
                  <p className="text-sm text-indigo-700 font-semibold">
                    🎯 Selected Career Path
                  </p>
                  <p className="text-lg font-bold text-indigo-900">{selectedCareer.title}</p>
                </motion.div>
              )}

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {authMode === 'signup' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <input
                      type="text"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                      placeholder="Your full name"
                      required={authMode === 'signup'}
                    />
                  </motion.div>
                )}

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder="Email address"
                  required
                />

                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all"
                  placeholder={authMode === 'signup' ? "Password (min 6 characters)" : "Your password"}
                  required
                />

                {/* Remember Me & Forgot Password */}
                {authMode === 'login' && (
                  <div className="flex items-center justify-between text-sm">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-slate-600">Remember me</span>
                    </label>
                    <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium">
                      Forgot password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-indigo-500/30 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                >
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      {authMode === 'signup' ? 'Creating account...' : 'Signing in...'}
                    </span>
                  ) : (
                    authMode === 'signup' ? 'Continue' : 'Sign In'
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-slate-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white text-slate-500">or continue with</span>
                </div>
              </div>

              {/* Social Login Buttons */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  <span className="text-sm font-medium text-slate-700">Google</span>
                </button>
                <button
                  type="button"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-4 py-2 border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
                >
                  <svg className="w-5 h-5 text-slate-900" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                  <span className="text-sm font-medium text-slate-700">GitHub</span>
                </button>
              </div>

              {/* Terms */}
              {authMode === 'signup' && (
                <p className="mt-6 text-xs text-center text-slate-500">
                  By signing up, you agree to our{' '}
                  <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Terms of Service
                  </button>{' '}
                  and{' '}
                  <button type="button" className="text-indigo-600 hover:text-indigo-700 font-medium">
                    Privacy Policy
                  </button>
                </p>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}