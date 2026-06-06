import { useState, useEffect } from 'react';
import { calculateBurnoutScore, BURNOUT_THRESHOLDS } from '../utils/burnout';
import { useCheckins } from './useCheckins';

export const useBurnoutScore = () => {
  const { checkins } = useCheckins();
  const [score, setScore] = useState(0);
  const [zone, setZone] = useState('Thriving');

  useEffect(() => {
    const currentScore = calculateBurnoutScore(checkins);
    setScore(currentScore);

    if (currentScore <= BURNOUT_THRESHOLDS.THRIVING) {
      setZone('Thriving');
    } else if (currentScore <= BURNOUT_THRESHOLDS.WATCH) {
      setZone('Watch Zone');
    } else if (currentScore <= BURNOUT_THRESHOLDS.AT_RISK) {
      setZone('At Risk');
    } else {
      setZone('Crisis');
    }
  }, [checkins]);

  return { score, zone };
};
