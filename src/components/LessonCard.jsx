// src/components/LessonCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, TrendingUp } from 'lucide-react';

const LessonCard = ({ lesson, onClick }) => {
  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="cursor-pointer bg-white rounded-2xl shadow-md hover:shadow-xl transition-all overflow-hidden"
    >
      {/* Header with Gradient */}
      <div className={`h-32 bg-gradient-to-br ${lesson.color} relative p-6`}>
        <div className="text-5xl mb-2">{lesson.icon}</div>
        <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
          <span className="text-white text-sm font-medium">{lesson.difficulty}</span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-slate-800 mb-3">
          {lesson.title}
        </h3>
        
        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-4 h-4" />
            <span>{lesson.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4" />
            <span>{lesson.progress}% complete</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-2 bg-slate-200 rounded-full overflow-hidden mb-4">
          <div 
            className={`h-full bg-gradient-to-r ${lesson.color}`}
            style={{ width: `${lesson.progress}%` }}
          />
        </div>

        {/* Start Button */}
        <button className="w-full py-3 bg-slate-900 text-white rounded-xl font-semibold flex items-center justify-center gap-2 hover:bg-slate-800 transition-colors">
          <Play className="w-5 h-5" />
          {lesson.progress > 0 ? 'Continue' : 'Start Lesson'}
        </button>
      </div>
    </motion.div>
  );
};

export default LessonCard;