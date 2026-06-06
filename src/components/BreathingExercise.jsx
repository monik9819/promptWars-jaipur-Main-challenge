import React, { useState, useEffect } from 'react';

const BreathingExercise = () => {
  const [phase, setPhase] = useState('idle'); // idle, inhale, hold, exhale
  const [cycle, setCycle] = useState(0);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  useEffect(() => {
    let timeout;
    
    if (phase === 'inhale') {
      timeout = setTimeout(() => setPhase('hold'), 4000); // 4s inhale
    } else if (phase === 'hold') {
      timeout = setTimeout(() => setPhase('exhale'), 7000); // 7s hold
    } else if (phase === 'exhale') {
      timeout = setTimeout(() => {
        if (cycle < 3) {
          setCycle(c => c + 1);
          setPhase('inhale');
        } else {
          setPhase('idle');
          setCycle(0);
        }
      }, 8000); // 8s exhale
    }

    return () => clearTimeout(timeout);
  }, [phase, cycle]);

  const startExercise = () => {
    setCycle(0);
    setPhase('inhale');
  };

  const getPhaseText = () => {
    switch (phase) {
      case 'inhale': return 'Breathe In...';
      case 'hold': return 'Hold...';
      case 'exhale': return 'Breathe Out...';
      default: return 'Start 4-7-8 Breathing';
    }
  };

  const getAnimationClass = () => {
    if (prefersReducedMotion) return '';
    
    switch (phase) {
      case 'inhale': return 'scale-[2] transition-transform duration-[4000ms] ease-linear bg-indigo-200';
      case 'hold': return 'scale-[2] transition-colors duration-1000 bg-violet-200';
      case 'exhale': return 'scale-100 transition-transform duration-[8000ms] ease-linear bg-slate-200';
      default: return 'scale-100 bg-indigo-100';
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-sm border border-slate-100">
      <div className="relative w-48 h-48 flex items-center justify-center mb-6">
        {/* Animated Circle */}
        <div 
          className={`absolute w-16 h-16 rounded-full opacity-50 ${getAnimationClass()}`}
        ></div>
        
        {/* Center Text */}
        <div className="relative z-10 text-center">
          <p className="font-medium text-slate-700">{getPhaseText()}</p>
          {phase !== 'idle' && (
            <p className="text-xs text-slate-500 mt-1">Cycle {cycle + 1} of 4</p>
          )}
        </div>
      </div>
      
      {phase === 'idle' && (
        <button 
          onClick={startExercise}
          className="px-6 py-2 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition-colors"
        >
          Begin Exercise
        </button>
      )}
      
      {phase !== 'idle' && prefersReducedMotion && (
        <p className="text-sm text-slate-500 mt-4 text-center">
          Inhale for 4s, hold for 7s, exhale for 8s.
        </p>
      )}
    </div>
  );
};

export default BreathingExercise;
