import React from 'react';
import { RadialBarChart, RadialBar, ResponsiveContainer, PolarAngleAxis } from 'recharts';

const BurnoutGauge = ({ score, zone }) => {
  // score is 0-100
  let fill = '#10b981'; // emerald-500
  if (score > 40 && score <= 65) fill = '#fbbf24'; // amber-400
  if (score > 65 && score <= 80) fill = '#f97316'; // orange-500
  if (score > 80) fill = '#f43f5e'; // rose-500

  const data = [
    {
      name: 'Burnout',
      value: score,
      fill: fill,
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center w-full h-full relative" aria-label={`Burnout gauge. Current score: ${score}, Zone: ${zone}`}>
      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <RadialBarChart 
            cx="50%" 
            cy="100%" 
            innerRadius="70%" 
            outerRadius="100%" 
            barSize={20} 
            data={data} 
            startAngle={180} 
            endAngle={0}
          >
            <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
            <RadialBar 
              minAngle={15} 
              background={{ fill: '#f1f5f9' }} // slate-100
              clockWise
              dataKey="value" 
              cornerRadius={10}
            />
          </RadialBarChart>
        </ResponsiveContainer>
      </div>
      <div className="absolute bottom-4 flex flex-col items-center">
        <span className="text-3xl font-bold text-slate-800">{score}</span>
        <span className={`text-sm font-semibold uppercase tracking-wider mt-1`} style={{ color: fill }}>
          {zone}
        </span>
      </div>
    </div>
  );
};

export default BurnoutGauge;
