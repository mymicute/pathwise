// src/components/TriviaQuestion.jsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';

const TriviaQuestion = ({ question, onAnswer }) => {
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSelect = (option) => {
    setSelectedOption(option);
    setTimeout(() => {
      onAnswer(option);
    }, 400);
  };

  return (
    <motion.div
      key={question.id}
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="bg-white rounded-3xl shadow-xl p-8"
    >
      <div className="text-center mb-8">
        <span className="text-4xl mb-4 block">{question.icon}</span>
        <h3 className="text-2xl font-bold text-slate-800">
          {question.question}
        </h3>
      </div>

      <div className="space-y-3">
        {question.options.map((option, index) => (
          <motion.button
            key={index}
            onClick={() => handleSelect(option)}
            whileHover={{ scale: 1.02, x: 8 }}
            whileTap={{ scale: 0.98 }}
            className={`
              w-full p-4 rounded-xl text-left font-medium transition-all
              ${selectedOption === option 
                ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg' 
                : 'bg-slate-50 text-slate-700 hover:bg-indigo-50 hover:shadow-md'
              }
            `}
          >
            <div className="flex items-center justify-between">
              <span>{option}</span>
              <motion.span
                animate={selectedOption === option ? { rotate: 360 } : {}}
                transition={{ duration: 0.3 }}
              >
                {selectedOption === option && '✓'}
              </motion.span>
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );
};

export default TriviaQuestion;