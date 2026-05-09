import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { BookOpen, Trophy, Clock, TrendingUp, Compass, LogOut } from 'lucide-react';
import NaviMascot from '../components/NaviMascot';
import LessonCard from '../components/LessonCard';

export default function Dashboard() {
  const navigate = useNavigate();
  const { userData, logout } = useAuth();
  const [activeTab, setActiveTab] = useState('lessons');

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!userData) return <div className="min-h-screen flex items-center justify-center bg-slate-50">Loading your path...</div>;

  const sampleLessons = [
    { id: 1, title: 'Introduction to Fundamentals', duration: '45 min', progress: userData.lessons?.['1'] || 0, difficulty: 'Beginner', icon: '', color: 'from-blue-500 to-cyan-500' },
    { id: 2, title: 'Core Concepts Deep Dive', duration: '60 min', progress: userData.lessons?.['2'] || 0, difficulty: 'Intermediate', icon: '🎯', color: 'from-purple-500 to-pink-500' },
    { id: 3, title: 'Practical Applications', duration: '90 min', progress: userData.lessons?.['3'] || 0, difficulty: 'Advanced', icon: '', color: 'from-orange-500 to-red-500' },
    { id: 4, title: 'Real-World Projects', duration: '120 min', progress: userData.lessons?.['4'] || 0, difficulty: 'Expert', icon: '', color: 'from-green-500 to-emerald-500' }
  ];

  const totalProgress = Object.values(userData.lessons || {}).reduce((a, b) => a + b, 0);
  const completedLessons = Object.values(userData.lessons || {}).filter(p => p >= 100).length;

  const stats = [
    { icon: BookOpen, label: 'Lessons', value: completedLessons, color: 'text-blue-500' },
    { icon: Clock, label: 'Hours', value: Math.floor(totalProgress / 60), color: 'text-purple-500' },
    { icon: Trophy, label: 'Streak', value: `${userData.streak || 0} days`, color: 'text-yellow-500' },
    { icon: TrendingUp, label: 'Progress', value: `${Math.round((totalProgress / (sampleLessons.length * 100)) * 100)}%`, color: 'text-green-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <nav className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <NaviMascot size={40} animated={true} />
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">PathWise</span>
            </div>
            <div className="flex items-center gap-4">
              <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-full">
                <Compass className="w-4 h-4 text-indigo-600" />
                <span className="text-sm font-medium text-indigo-700">{userData.selectedCareer || 'Career Path'}</span>
              </div>
              <button onClick={handleLogout} className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-600 transition-colors">
                <LogOut className="w-5 h-5" />
                <span className="hidden sm:inline">Logout</span>
              </button>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">{userData.userName?.charAt(0) || 'U'}</div>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 mb-2">Welcome back, {userData.userName}! </h1>
          <p className="text-slate-600">Ready to continue your journey in {userData.selectedCareer}?</p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }} className="bg-white rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <stat.icon className={`w-8 h-8 ${stat.color} mb-2`} />
              <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
              <div className="text-sm text-slate-600">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        <div className="flex gap-2 mb-6 overflow-x-auto">
          {['lessons', 'progress', 'achievements'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full font-medium capitalize whitespace-nowrap ${activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-white text-slate-600 hover:bg-slate-50'}`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === 'lessons' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sampleLessons.map((lesson, index) => (
              <motion.div key={lesson.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.1 }}>
                <LessonCard lesson={lesson} onClick={() => navigate(`/lesson/${lesson.id}`)} />
              </motion.div>
            ))}
          </div>
        )}

        {activeTab === 'progress' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-8 text-center">
            <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Track Your Progress</h3>
            <p className="text-slate-600">Complete lessons to see your progress here</p>
          </motion.div>
        )}

        {activeTab === 'achievements' && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-white rounded-2xl p-8 text-center">
            <Compass className="w-16 h-16 text-indigo-500 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Earn Achievements</h3>
            <p className="text-slate-600">Complete challenges to unlock badges</p>
          </motion.div>
        )}
      </main>

      <motion.div className="fixed bottom-6 right-6 z-40" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
        <div className="bg-white rounded-full p-3 shadow-lg">
          <NaviMascot size={48} animated={true} />
        </div>
      </motion.div>
    </div>
  );
}