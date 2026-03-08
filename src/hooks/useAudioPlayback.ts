import { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import {
  setIsPlaying,
  setDuration,
} from '../store/playerSlice';
import audioService from '../services/audioService';


export const useAudioPlayback = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentSong, isPlaying } = useSelector(
    (state: RootState) => state.player
  );
  const previousSongIdRef = useRef<string | null>(null);


  useEffect(() => {
    const setupAudio = async () => {
      await audioService.initialize();
    };
    setupAudio();
  }, []);

  useEffect(() => {
    if (!currentSong) return;

    if (previousSongIdRef.current !== currentSong.id) {
   
      console.log('New song selected:', currentSong.name);
      audioService.playSong(currentSong);
      previousSongIdRef.current = currentSong.id;
      dispatch(setIsPlaying(true));

      if (currentSong.duration) {
        dispatch(setDuration(currentSong.duration));
      }
    } else {
  
      if (isPlaying) {
        audioService.play();
      }
    }
  }, [currentSong?.id, dispatch, isPlaying]);

  return { audioService };
};
