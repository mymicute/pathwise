// src/pages/Landing.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import NaviMascot from '../components/NaviMascot';
import CareerCard from '../components/CareerCard';

const careers = [
  {
    id: 1,
    title: 'Software Dev',
    image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
    description: 'Build the future with code',
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 2,
    title: 'Data Science',
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    description: 'Unlock insights from data',
    color: 'from-green-500 to-teal-600'
  },
  {
    id: 3,
    title: 'UX Design',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    description: 'Craft beautiful experiences',
    color: 'from-pink-500 to-rose-600'
  },
  {
    id: 4,
    title: 'Marketing',
    image: 'https://images.unsplash.com/photo-1533750349088-cd871a92f312?w=400',
    description: 'Tell compelling stories',
    color: 'from-orange-500 to-red-600'
  },
  {
    id: 5,
    title: 'Finance',
    image: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=400',
    description: 'Master the markets',
    color: 'from-emerald-500 to-green-600'
  },
  {
    id: 6,
    title: 'Healthcare',
    image: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=400',
    description: 'Heal and help others',
    color: 'from-cyan-500 to-blue-600'
  },
  {
    id: 7,
    title: 'AI & ML',
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    description: 'Shape intelligent systems',
    color: 'from-violet-500 to-purple-600'
  },
  {
    id: 8,
    title: 'Cybersecurity',
    image: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=400',
    description: 'Protect digital assets',
    color: 'from-red-500 to-pink-600'
  }
];

const Landing = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState(null);
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleCardClick = (career) => {
    setSelectedCard(career);
    setTimeout(() => {
      navigate('/signup', { state: { selectedCareer: career } });
    }, 600);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 overflow-hidden">
      {/* Header */}
      <motion.header 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 p-6 flex justify-between items-center"
      >
        <div className="flex items-center gap-3">
          <NaviMascot size={48} animated={true} />
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            PathWise
          </h1>
        </div>
        <button 
          onClick={() => navigate('/signup')}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition-colors"
        >
          Get Started
        </button>
      </motion.header>

      {/* Central Logo Area */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-0">
        <motion.div
          animate={{ 
            rotate: 360,
            scale: [1, 1.1, 1]
          }}
          transition={{ 
            rotate: { duration: 20, repeat: Infinity, ease: "linear" },
            scale: { duration: 3, repeat: Infinity }
          }}
          className="w-32 h-32 opacity-10"
        >
          <NaviMascot size={128} />
        </motion.div>
      </div>

      {/* Career Cards Grid */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8 pt-24">
        <div className="max-w-6xl w-full">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
              Choose Your Path
            </h2>
            <p className="text-lg text-slate-600">
              Select a career to begin your intensive learning journey
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {careers.map((career, index) => (
              <motion.div
                key={career.id}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <CareerCard
                  career={career}
                  isHovered={hoveredCard === career.id}
                  onHover={() => setHoveredCard(career.id)}
                  onUnhover={() => setHoveredCard(null)}
                  onClick={() => handleCardClick(career)}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Navi Mascot */}
      <motion.div
        className="fixed bottom-8 right-8 z-40"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <NaviMascot size={64} animated={true} />
      </motion.div>
    </div>
  );
};

export default Landing;