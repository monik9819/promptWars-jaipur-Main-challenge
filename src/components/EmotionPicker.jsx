import React from 'react';

const emotionsList = [
  'Anxious', 'Hopeful', 'Overwhelmed', 'Focused', 'Tired', 
  'Confident', 'Lonely', 'Irritable', 'Calm', 'Excited'
];

const EmotionPicker = ({ selected, onChange }) => {
  const toggleEmotion = (emotion) => {
    if (selected.includes(emotion)) {
      onChange(selected.filter(e => e !== emotion));
    } else {
      onChange([...selected, emotion]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {emotionsList.map(emotion => (
        <button
          key={emotion}
          type="button"
          onClick={() => toggleEmotion(emotion)}
          aria-pressed={selected.includes(emotion)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            selected.includes(emotion)
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-indigo-300 hover:bg-indigo-50'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
        >
          {emotion}
        </button>
      ))}
    </div>
  );
};

export default EmotionPicker;
