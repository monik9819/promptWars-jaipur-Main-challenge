import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const MoodChart = ({ data }) => {
  // data should be an array of { day: 'Mon', score: 7 }
  
  const average = data && data.length > 0 
    ? data.reduce((sum, item) => sum + item.score, 0) / data.length 
    : 0;

  if (!data || data.length === 0) {
    return (
      <div className="h-full w-full flex items-center justify-center text-slate-400">
        No mood data for the last 7 days.
      </div>
    );
  }

  return (
    <div className="h-full w-full min-h-[200px]" aria-label="7 day mood trend chart">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{
            top: 5,
            right: 10,
            left: -20,
            bottom: 0,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
          <XAxis 
            dataKey="day" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }} 
            dy={10}
          />
          <YAxis 
            yAxisId="left"
            domain={[1, 10]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 12 }}
            ticks={[2, 4, 6, 8, 10]}
          />
          <YAxis 
            yAxisId="right"
            orientation="right"
            domain={[0, 16]} 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#94a3b8', fontSize: 12 }}
            ticks={[4, 8, 12, 16]}
          />
          <Tooltip 
            contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            labelStyle={{ color: '#64748b', marginBottom: '4px' }}
          />
          {average > 0 && (
            <ReferenceLine y={average} yAxisId="left" stroke="#a5b4fc" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'avg mood', fill: '#a5b4fc', fontSize: 12 }} />
          )}
          <Line 
            yAxisId="left"
            name="Mood Score"
            type="monotone" 
            dataKey="score" 
            stroke="#6366f1" 
            strokeWidth={3} 
            dot={{ r: 4, fill: '#6366f1', strokeWidth: 2, stroke: '#fff' }} 
            activeDot={{ r: 6 }} 
          />
          <Line 
            yAxisId="right"
            name="Study Hours"
            type="monotone" 
            dataKey="hours" 
            stroke="#94a3b8" 
            strokeWidth={2} 
            strokeDasharray="5 5"
            dot={{ r: 3, fill: '#94a3b8', strokeWidth: 2, stroke: '#fff' }} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MoodChart;
