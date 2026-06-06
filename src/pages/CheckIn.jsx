import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCheckins } from '../hooks/useCheckins';
import { useAuth } from '../hooks/useAuth';
import { generateSystemPrompt } from '../utils/aiContext';
import MoodSlider from '../components/MoodSlider';
import EmotionPicker from '../components/EmotionPicker';
import TriggerTags from '../components/TriggerTags';
import { ArrowRight, ArrowLeft, CheckCircle2, Sparkles, MessageSquareHeart, LayoutDashboard } from 'lucide-react';

const CheckIn = () => {
  const navigate = useNavigate();
  const { addCheckin, checkins } = useCheckins();
  const { user } = useAuth();
  
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    mood_score: 5,
    study_hours: 0,
    emotions: [],
    triggers: [],
    journal_text: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [aiTip, setAiTip] = useState('');

  const handleNext = () => setStep(s => s + 1);
  const handlePrev = () => setStep(s => s - 1);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    addCheckin(formData);
    
    try {
      // Get a quick AI tip based on this check-in
      const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
      const prompt = `The user just checked in with a mood of ${formData.mood_score}/10 and studied for ${formData.study_hours} hours today. They feel ${formData.emotions.join(', ')}. Triggers: ${formData.triggers.join(', ')}. Journal: ${formData.journal_text}. Give a ONE SENTENCE encouraging and practical tip.`;
      
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{ role: 'system', content: prompt }],
          temperature: 0.7,
          max_tokens: 50
        })
      });

      if (response.ok) {
        const data = await response.json();
        setAiTip(data.choices[0].message.content);
      } else {
        setAiTip("Remember to take things one step at a time. You're doing great.");
      }
    } catch (error) {
      setAiTip("Remember to take things one step at a time. You're doing great.");
    }

    setIsSubmitting(false);
    setShowSuccess(true);
  };

  if (showSuccess) {
    return (
      <div className="flex-1 bg-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 shadow-sm border border-slate-100 text-center animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-emerald-500" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Check-in Complete!</h2>
          <p className="text-slate-500 mb-8">Your mood has been logged successfully.</p>
          
          <div className="bg-indigo-50 rounded-2xl p-6 mb-8 text-left relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Sparkles className="w-16 h-16 text-indigo-600" />
            </div>
            <div className="flex items-center space-x-2 text-indigo-700 font-semibold mb-2 relative z-10">
              <Sparkles className="w-5 h-5" />
              <span>AI Insight for You</span>
            </div>
            <p className="text-indigo-900 leading-relaxed relative z-10">{aiTip}</p>
          </div>

          <div className="space-y-3">
            <button onClick={() => navigate('/chat', { state: { initialPrompt: "I just finished my check-in. Can we talk?" } })} className="w-full flex items-center justify-center px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition-colors">
              <MessageSquareHeart className="w-5 h-5 mr-2" />
              Talk to AI Companion
            </button>
            <button onClick={() => navigate('/dashboard')} className="w-full flex items-center justify-center px-6 py-3 bg-white border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors">
              <LayoutDashboard className="w-5 h-5 mr-2" />
              View Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 flex flex-col items-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-slate-100 p-6 sm:p-10 min-h-[500px] flex flex-col">
        
        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full mb-8 overflow-hidden">
          <div 
            className="h-full bg-indigo-500 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>

        <div className="flex-1 flex flex-col">
          {step === 1 && (
            <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-right-8 duration-300 fade-in">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-12">How are you feeling today?</h2>
              <MoodSlider 
                value={formData.mood_score} 
                onChange={(val) => setFormData({...formData, mood_score: val})} 
              />
            </div>
          )}

          {step === 2 && (
            <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-right-8 duration-300 fade-in">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">How many hours did you study today?</h2>
              <p className="text-center text-slate-500 mb-12">Be honest, rest is important too.</p>
              <div className="px-4">
                <input 
                  type="range" 
                  min="0" 
                  max="16" 
                  step="0.5"
                  value={formData.study_hours} 
                  onChange={(e) => setFormData({...formData, study_hours: parseFloat(e.target.value)})}
                  className="w-full h-3 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
                  aria-label="Study hours slider"
                  aria-valuemin="0"
                  aria-valuemax="16"
                  aria-valuenow={formData.study_hours}
                />
                <div className="text-center mt-6 text-3xl font-bold text-indigo-600">
                  {formData.study_hours} {formData.study_hours === 1 ? 'Hour' : 'Hours'}
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-right-8 duration-300 fade-in">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">What emotions are present?</h2>
              <p className="text-center text-slate-500 mb-8">Select all that apply</p>
              <EmotionPicker 
                selected={formData.emotions} 
                onChange={(val) => setFormData({...formData, emotions: val})} 
              />
            </div>
          )}

          {step === 4 && (
            <div className="flex-1 flex flex-col justify-center animate-in slide-in-from-right-8 duration-300 fade-in">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Any specific triggers?</h2>
              <p className="text-center text-slate-500 mb-8">What's contributing to your mood?</p>
              <TriggerTags 
                selected={formData.triggers} 
                onChange={(val) => setFormData({...formData, triggers: val})} 
              />
            </div>
          )}

          {step === 5 && (
            <div className="flex-1 flex flex-col animate-in slide-in-from-right-8 duration-300 fade-in">
              <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Journal (Optional)</h2>
              <p className="text-center text-slate-500 mb-6">What's weighing on you today? Or what went well?</p>
              
              <div className="flex-1 flex flex-col relative">
                <textarea
                  className="w-full flex-1 p-4 bg-slate-50 border border-slate-200 rounded-2xl resize-none focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-slate-700"
                  placeholder="Start typing here..."
                  maxLength={500}
                  value={formData.journal_text}
                  onChange={(e) => setFormData({...formData, journal_text: e.target.value})}
                  aria-label="Journal entry"
                ></textarea>
                <div className="absolute bottom-4 right-4 text-xs font-medium text-slate-400">
                  {formData.journal_text.length}/500
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="mt-10 flex items-center justify-between">
          <button
            onClick={handlePrev}
            disabled={step === 1 || isSubmitting}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
              step === 1 ? 'opacity-0 cursor-default' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back
          </button>
          
          {step < 5 ? (
            <button
              onClick={handleNext}
              className="flex items-center px-6 py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Next <ArrowRight className="w-4 h-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="flex items-center px-8 py-2.5 bg-emerald-500 text-white text-sm font-bold rounded-xl hover:bg-emerald-600 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-wait"
            >
              {isSubmitting ? 'Saving...' : 'Finish Check-In'}
            </button>
          )}
        </div>
        
      </div>
    </div>
  );
};

export default CheckIn;
