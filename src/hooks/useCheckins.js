import { useState, useEffect, useCallback } from 'react';
import { getCheckins, saveCheckin } from '../utils/storage';
import { useAuth } from './useAuth';

export const useCheckins = () => {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState([]);
  const [streak, setStreak] = useState(0);

  const loadCheckins = useCallback(() => {
    if (user?.email) {
      const data = getCheckins(user.email);
      setCheckins(data);
      calculateStreak(data);
    }
  }, [user]);

  useEffect(() => {
    loadCheckins();
  }, [loadCheckins]);

  const addCheckin = (checkinData) => {
    if (!user?.email) return;
    const newCheckin = {
      ...checkinData,
      date: new Date().toISOString().split('T')[0],
      timestamp: Date.now()
    };
    saveCheckin(user.email, newCheckin);
    loadCheckins(); // Reload to update state and streak
  };

  const calculateStreak = (data) => {
    if (!data || data.length === 0) {
      setStreak(0);
      return;
    }
    
    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Sort by timestamp descending
    const sorted = [...data].sort((a, b) => b.timestamp - a.timestamp);
    
    // Check if there is a check-in today or yesterday to continue the streak
    const lastCheckinDate = new Date(sorted[0].timestamp);
    lastCheckinDate.setHours(0, 0, 0, 0);
    
    const diffDays = Math.round((today - lastCheckinDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays > 1) {
      setStreak(0); // Streak broken
      return;
    }

    // Calculate contiguous days
    let checkDate = new Date(lastCheckinDate);
    const uniqueDays = new Set(sorted.map(c => {
        const d = new Date(c.timestamp);
        d.setHours(0,0,0,0);
        return d.getTime();
    }));

    while (uniqueDays.has(checkDate.getTime())) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
    }

    setStreak(currentStreak);
  };

  return { checkins, streak, addCheckin };
};
