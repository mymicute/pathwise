// src/components/CareerCard.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const CareerCard = ({ career, isHovered, onHover, onUnhover, onClick }) => {
  return (
    <motion.div
      layoutId={`card-${career.id}`}
      className="relative cursor-pointer group"
      onHoverStart={onHover}
      onHoverEnd={onUnhover}
      onClick={onClick}
      whileHover={{ scale: 1.05, zIndex: 50 }}
      whileTap={{ scale: 0.95 }}
    >
      <div className={`
        relative overflow-hidden rounded-2xl bg-white shadow-lg
        transform transition-all duration-300
        ${isHovered ? 'shadow-2xl' : 'shadow-md'}
      `}>
        {/* Image Container */}
        <div className="relative h-48 overflow-hidden">
          <motion.img
            src={career.image}
            alt={career.title}
            className="w-full h-full object-cover"
            animate={{ scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.3 }}
          />
          <div className={`
            absolute inset-0 bg-gradient-to-t ${career.color} 
            opacity-0 group-hover:opacity-60 transition-opacity duration-300
          `} />
          
          {/* Expand Icon */}
          <motion.div
            className="absolute top-3 right-3 w-8 h-8 bg-white rounded-full flex items-center justify-center"
            animate={{ rotate: isHovered ? 45 : 0, scale: isHovered ? 1.2 : 1 }}
          >
            <ArrowUpRight className="w-4 h-4 text-slate-800" />
          </motion.div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="text-xl font-bold text-slate-800 mb-2">
            {career.title}
          </h3>
          <p className="text-slate-600 text-sm">
            {career.description}
          </p>
        </div>

        {/* Hover Gradient Border */}
        <div className={`
          absolute inset-0 rounded-2xl bg-gradient-to-r ${career.color}
          opacity-0 group-hover:opacity-100 transition-opacity duration-300
          -z-10 blur-sm
        `} />
      </div>
    </motion.div>
  );
};

export default CareerCard;