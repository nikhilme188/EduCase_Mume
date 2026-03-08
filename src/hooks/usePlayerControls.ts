import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { setCurrentTime } from '../store/playerSlice';
import audioService from '../services/audioService';

/**
 * Hook: Progress Tracking
 * Handles: Real-time progress updates, interval management, cleanup
 */
export const useProgressTracking = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { isPlaying, currentSong } = useSelector(
    (state: RootState) => state.player
  );
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  
  useEffect(() => {
    if (!isPlaying || !currentSong) {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
      return;
    }

  
    progressIntervalRef.current = setInterval(async () => {
      try {
        const progress = await audioService.getProgress();
        if (progress) {
          dispatch(setCurrentTime(progress.position));
        }
      } catch (error) {
        console.error('Error updating progress:', error);
      }
    }, 500);

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, [isPlaying, currentSong, dispatch]);

  
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
        progressIntervalRef.current = null;
      }
    };
  }, []);
};
