import { useEffect, useState } from 'react';
import { Localize } from '../locale/Loc';

export const useChrono = (initialState = 0) => {
  const [timer, setTimer] = useState(initialState);
  const [status, setStatus] = useState(0);
  const [currentInterval, setCurrentInterval] = useState();

  useEffect(() => {
    if (status === 1 && !currentInterval) {
      const interval = setInterval(() => {
        setTimer(timer => setTimer(timer + 1));
      }, 1000);
      setCurrentInterval(interval);
    }
    if (status === 2 || status === 0) {
      clearInterval(currentInterval);
      setCurrentInterval(undefined);
    }
  }, [timer, status, setTimer, setStatus, setCurrentInterval]);

  const handleStopTiming = () => setStatus(2);
  const handleResumeTiming = () => setStatus(1);
  const handleResetTimer = () => {
    setStatus(0);
    setTimer(0);
  };

  return [timer, status, handleResumeTiming, handleStopTiming, handleResetTimer];
};

export const chronoStatusString = status => {
  switch (status) {
    case 0:
      return Localize('Chrono.Status0'); // NOT STARTED
    case 1:
      return Localize('Chrono.Status1'); // PLAYING
    case 2:
      return Localize('Chrono.Status2'); // PAUSED
    default:
      return '';
  }
};
