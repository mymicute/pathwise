// src/components/NaviMascot.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { Compass } from 'lucide-react';

const NaviMascot = ({ size = 64, animated = false }) => {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Glow Effect */}
      {animated && (
        <motion.div
          className="absolute inset-0 bg-indigo-400 rounded-full blur-xl"
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.5, 0.8, 0.5]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      )}
      
      {/* Compass Icon */}
      <motion.div
        className="relative w-full h-full bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg"
        animate={animated ? {
          rotate: [0, 10, -10, 0],
        } : {}}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <Compass className="w-3/5 h-3/5 text-white" strokeWidth={2.5} />
        
        {/* Sparkles */}
        {animated && (
          <>
            <motion.div
              className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full"
              animate={{ scale: [1, 1.5, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
            <motion.div
              className="absolute -bottom-1 -left-1 w-2 h-2 bg-cyan-400 rounded-full"
              animate={{ scale: [1, 1.3, 1], opacity: [1, 0, 1] }}
              transition={{ duration: 1.8, repeat: Infinity, delay: 0.5 }}
            />
          </>
        )}
      </motion.div>

      {/* Name Tag */}
      <motion.div
        className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 bg-white px-2 py-0.5 rounded-full shadow-md"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <span className="text-xs font-bold text-indigo-600">Navi</span>
      </motion.div>
    </div>
  );
};

export default NaviMascot;