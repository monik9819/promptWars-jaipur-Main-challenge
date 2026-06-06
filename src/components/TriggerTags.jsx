import React from 'react';

const triggersList = [
  'Syllabus pressure', 'Mock test scores', 'Sleep issues', 'Family expectations',
  'Peer comparison', 'Social media', 'Physical health', 'Time management', 
  'Fear of failure', 'Exam day nerves'
];

const TriggerTags = ({ selected, onChange }) => {
  const toggleTrigger = (trigger) => {
    if (selected.includes(trigger)) {
      onChange(selected.filter(t => t !== trigger));
    } else {
      onChange([...selected, trigger]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      {triggersList.map(trigger => (
        <button
          key={trigger}
          type="button"
          onClick={() => toggleTrigger(trigger)}
          aria-pressed={selected.includes(trigger)}
          className={`px-3 py-1.5 rounded-md text-sm transition-colors ${
            selected.includes(trigger)
              ? 'bg-amber-100 text-amber-800 border border-amber-200 font-medium'
              : 'bg-white text-slate-600 border border-slate-200 hover:border-amber-300 hover:bg-amber-50'
          } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-amber-500`}
        >
          {trigger}
        </button>
      ))}
    </div>
  );
};

export default TriggerTags;
