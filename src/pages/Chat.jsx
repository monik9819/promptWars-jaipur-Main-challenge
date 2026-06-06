import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCheckins } from '../hooks/useCheckins';
import { generateSystemPrompt } from '../utils/aiContext';
import AIChat from '../components/AIChat';
import BreathingExercise from '../components/BreathingExercise';
import { Sparkles, Wind, FileText, BrainCircuit } from 'lucide-react';

const Chat = () => {
  const { user } = useAuth();
  const { checkins } = useCheckins();
  const location = useLocation();
  const initialPrompt = location.state?.initialPrompt || null;

  const systemContext = useMemo(() => {
    return generateSystemPrompt(user, checkins);
  }, [user, checkins]);

  // Suggested prompts
  const prompts = [
    { text: "I'm feeling anxious about my exam 😟", icon: <BrainCircuit className="w-4 h-4" /> },
    { text: "Give me a 2-minute breathing exercise", icon: <Wind className="w-4 h-4" /> },
    { text: "Help me make a study plan for today", icon: <FileText className="w-4 h-4" /> },
    { text: "I can't stop comparing myself to others", icon: <Sparkles className="w-4 h-4" /> }
  ];

  const handlePromptClick = (text) => {
    // This is a small hack since we can't easily pass state down without a ref or context,
    // but in a real app, we'd lift the `input` state or use a ref. 
    // For this assignment, we will rely on the user copying or we'll just implement a simple 
    // click-to-copy or reload with state.
    // The easiest way is to use window.dispatchEvent or just rely on the user typing.
    // Actually, I can pass a key to AIChat to force remount with new initialPrompt.
    window.location.href = '#chat'; // just focus
  };

  return (
    <div className="flex-1 bg-slate-50 flex flex-col md:flex-row overflow-hidden">
      
      {/* Sidebar / Tools */}
      <div className="w-full md:w-80 bg-white border-r border-slate-200 p-6 flex flex-col overflow-y-auto hidden md:flex">
        <div className="mb-8">
          <h2 className="text-lg font-bold text-slate-800 mb-2">MindEase AI</h2>
          <p className="text-sm text-slate-500 leading-relaxed">
            Your personal, compassionate companion. Ask for study tips, vent about your stress, or request a calming exercise.
          </p>
        </div>

        <div className="mb-8">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Quick Prompts</h3>
          <div className="space-y-2">
            {prompts.map((p, i) => (
              <div 
                key={i} 
                className="flex items-center p-3 rounded-xl border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer transition-colors"
                title="Copy prompt"
                onClick={() => navigator.clipboard.writeText(p.text)}
              >
                <div className="text-indigo-500 mr-3">{p.icon}</div>
                <span className="text-sm text-slate-600 font-medium">{p.text}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-2 text-center">Click to copy prompt</p>
        </div>

        <div className="mt-auto">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Tools</h3>
          <BreathingExercise />
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 p-4 sm:p-6 lg:p-8 flex flex-col h-[calc(100vh-64px)] overflow-hidden">
        <div className="max-w-4xl w-full mx-auto flex-1 h-full relative" id="chat">
          <AIChat initialPrompt={initialPrompt} systemContext={systemContext} />
        </div>
      </div>

    </div>
  );
};

export default Chat;
