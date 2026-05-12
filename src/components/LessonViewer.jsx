import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { TextStep, VideoStep, QuizStep, ExerciseStep } from './LessonSteps';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';

export default function LessonViewer({ lesson, onComplete }) {
  const { currentUser, userData, updateUserData } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);

  const totalSteps = lesson.steps.length;
  const progress = Math.round(((currentStep + 1) / totalSteps) * 100);
  const currentStepData = lesson.steps[currentStep];

  // Resume from saved progress
  useEffect(() => {
    if (userData?.lessons?.[lesson.id] !== undefined) {
      const saved = userData.lessons[lesson.id];
      const resumeStep = Math.min(
        Math.floor((saved / 100) * totalSteps),
        totalSteps - 1
      );
      setCurrentStep(resumeStep);
    }
  }, [lesson.id, userData]);

  // Auto-save progress
  useEffect(() => {
    if (!currentUser || savingRef.current) return;
    
    const save = async () => {
      savingRef.current = true;
      setSaving(true);
      try {
        await setDoc(doc(db, 'users', currentUser.uid), {
          lessons: { ...userData?.lessons, [lesson.id]: progress }
        }, { merge: true });
      } catch (err) {
        console.error('Save failed:', err);
      }
      setSaving(false);
      savingRef.current = false;
    };

    const timer = setTimeout(save, 600);
    return () => clearTimeout(timer);
  }, [currentStep, lesson.id, currentUser, userData]);

  const handleStepComplete = async (passed) => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setSaving(true);
      try {
        await updateUserData({
          lessons: { ...userData?.lessons, [lesson.id]: 100 },
          streak: (userData?.streak || 0) + 1
        });
        onComplete?.();
      } catch (err) {
        console.error('Completion failed:', err);
      }
      setSaving(false);
    }
  };

  const renderStep = () => {
    switch (currentStepData.type) {
      case 'text': return <TextStep step={currentStepData} />;
      case 'video': return <VideoStep step={currentStepData} />;
      case 'quiz': return <QuizStep step={currentStepData} onComplete={handleStepComplete} />;
      case 'exercise': return <ExerciseStep step={currentStepData} onComplete={handleStepComplete} />;
      default: return <p>Unknown step type</p>;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 font-bold">
            {currentStep + 1}
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-800">{currentStepData.title}</h2>
            <p className="text-sm text-slate-500">{currentStepData.type.toUpperCase()} • Step {currentStep + 1} of {totalSteps}</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-sm font-semibold text-indigo-600">{progress}%</span>
          {saving && <Loader2 className="w-4 h-4 animate-spin text-indigo-400 mt-1 ml-auto" />}
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-slate-200 rounded-full mb-8 overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" 
          initial={{ width: 0 }} 
          animate={{ width: `${progress}%` }} 
        />
      </div>

      {/* Step Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 md:p-8 min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation */}
      <div className="flex justify-between items-center mt-8">
        <button
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-300 text-slate-700 font-medium hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Previous
        </button>

        <div className="flex gap-2">
          {lesson.steps.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentStep(i)}
              className={`w-3 h-3 rounded-full transition-all ${
                i === currentStep ? 'bg-indigo-600 scale-125' : 
                i < currentStep ? 'bg-indigo-300' : 'bg-slate-300'
              }`}
            />
          ))}
        </div>

        {(currentStepData.type === 'text' || currentStepData.type === 'video') && (
          <button
            onClick={() => handleStepComplete(true)}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
          >
            Next <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}