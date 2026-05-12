import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, Play, Code, BookOpen } from 'lucide-react';

export function TextStep({ step }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="prose prose-lg max-w-none">
      <div className="flex items-center gap-2 mb-4 text-indigo-600">
        <BookOpen className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">Reading</span>
      </div>
      <p className="text-slate-700 leading-relaxed whitespace-pre-line">{step.content}</p>
    </motion.div>
  );
}

export function VideoStep({ step }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-4 text-red-600">
        <Play className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">Video Lesson • {step.duration}</span>
      </div>
      <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-slate-900 shadow-lg">
        <iframe 
          src={step.url} 
          title={step.title}
          className="absolute inset-0 w-full h-full"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </motion.div>
  );
}

export function QuizStep({ step, onComplete }) {
  const [selected, setSelected] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const isCorrect = selected === step.correctIndex;

  const handleSelect = (index) => {
    if (showResult) return;
    setSelected(index);
    setShowResult(true);
    setTimeout(() => onComplete(isCorrect), 1500);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-4 text-purple-600">
        <CheckCircle className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">Quiz</span>
      </div>
      <h3 className="text-xl font-bold text-slate-800 mb-4">{step.question}</h3>
      <div className="space-y-3">
        {step.options.map((option, index) => {
          let baseClass = "w-full p-4 text-left rounded-xl border-2 transition-all ";
          if (showResult) {
            if (index === step.correctIndex) baseClass += "border-green-500 bg-green-50 text-green-800";
            else if (index === selected && !isCorrect) baseClass += "border-red-500 bg-red-50 text-red-800";
            else baseClass += "border-slate-200 opacity-50";
          } else {
            baseClass += selected === index ? "border-indigo-500 bg-indigo-50" : "border-slate-200 hover:border-indigo-300 hover:bg-slate-50";
          }
          
          return (
            <button key={index} onClick={() => handleSelect(index)} className={baseClass} disabled={showResult}>
              <div className="flex items-center justify-between">
                <span className="font-medium">{option}</span>
                {showResult && index === step.correctIndex && <CheckCircle className="w-5 h-5 text-green-600" />}
                {showResult && index === selected && !isCorrect && <XCircle className="w-5 h-5 text-red-600" />}
              </div>
            </button>
          );
        })}
      </div>
      {showResult && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
          <p className="text-sm font-semibold mb-1">{isCorrect ? "✅ Correct!" : "❌ Not quite"}</p>
          <p className="text-slate-600 text-sm">{step.explanation}</p>
        </motion.div>
      )}
    </motion.div>
  );
}

export function ExerciseStep({ step, onComplete }) {
  const [text, setText] = useState('');
  const minLength = step.validation?.startsWith('min:') ? parseInt(step.validation.split(':')[1]) : 0;
  const isValid = text.trim().length >= minLength;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
      <div className="flex items-center gap-2 mb-4 text-orange-600">
        <Code className="w-5 h-5" />
        <span className="text-sm font-semibold uppercase tracking-wide">Exercise</span>
      </div>
      <p className="text-slate-700 mb-4 font-medium">{step.instruction}</p>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder={step.placeholder}
        className="w-full h-40 p-4 rounded-xl border border-slate-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none resize-none font-mono text-sm"
      />
      <div className="flex items-center justify-between mt-3">
        <span className={`text-sm ${isValid ? 'text-green-600' : 'text-slate-400'}`}>
          {isValid ? '✓ Ready to submit' : `${text.trim().length}/${minLength} characters`}
        </span>
        <button
          onClick={() => isValid && onComplete(true)}
          disabled={!isValid}
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Submit & Continue
        </button>
      </div>
    </motion.div>
  );
}