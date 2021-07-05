import { useEffect, useState } from 'react';
import { Localize } from '../locale/Loc';

export const useChrono = (duration, initialState = 0) => {
  const [timer, setTimer] = useState(initialState);
  const [status, setStatus] = useState(0);
  const [currentInterval, setCurrentInterval] = useState();
  const [type, setType] = useState('asc');

  useEffect(() => {
    if (status === 1 && !currentInterval && type === 'asc') {
      const interval = setInterval(() => {
        setTimer(timer => setTimer(timer + 1));
      }, 1000);
      setCurrentInterval(interval);
    }
    if (status === 1 && !currentInterval && type === 'desc') {
      const interval = setInterval(() => {
        setTimer(timer => setTimer(timer - 1));
      }, 1000);
      setCurrentInterval(interval);
    }
    if (status === 2 || status === 0) {
      clearInterval(currentInterval);
      setCurrentInterval(undefined);
    }
  }, [timer, status, type, setTimer, setStatus, setCurrentInterval, setType]);

  const handleStopTiming = () => setStatus(2);
  const handleResumeTiming = () => setStatus(1);
  const handleResetTimer = () => {
    setStatus(0);
    type === 'asc' ? setTimer(0) : setTimer(duration * 60);
  };
  const handleType = () => {
    if (type === 'asc') {
      setType('desc');
      setTimer(duration * 60 - timer);
    }
    if (type === 'desc') {
      setType('asc');
      setTimer(duration * 60 - timer);
    }
  };

  return [timer, status, type, handleResumeTiming, handleStopTiming, handleResetTimer, handleType];
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
