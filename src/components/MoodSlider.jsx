import React from 'react';

const emojis = ['😞', '😟', '😐', '🙂', '😊', '😄'];

const MoodSlider = ({ value, onChange }) => {
  const getEmojiIndex = (val) => {
    if (val <= 2) return 0;
    if (val <= 4) return 1;
    if (val <= 6) return 2;
    if (val <= 8) return 3;
    if (val < 10) return 4;
    return 5;
  };

  return (
    <div className="flex flex-col items-center w-full max-w-md mx-auto space-y-6">
      <div 
        className="text-7xl transition-transform duration-300 transform scale-110"
        aria-hidden="true"
      >
        {emojis[getEmojiIndex(value)]}
      </div>
      
      <div className="w-full space-y-4">
        <div className="flex justify-between text-sm font-medium text-slate-500">
          <span>Struggling</span>
          <span>Great</span>
        </div>
        
        <input
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          aria-label="Mood score"
          aria-valuemin="1"
          aria-valuemax="10"
          aria-valuenow={value}
        />
        
        <div className="text-center font-semibold text-indigo-600 text-xl">
          {value} / 10
        </div>
      </div>
    </div>
  );
};

export default MoodSlider;
