import { useEffect } from 'react';
import tetrisMusic from '../assets/Tetris.mp3';

interface AudioState {
  audio: HTMLAudioElement | null;
  isPlaying: boolean;
  volume: number;
}

const audioState: AudioState = {
  audio: null,
  isPlaying: false,
  volume: 0.5
};

export const initBackgroundMusic = () => {
  if (!audioState.audio) {
    audioState.audio = new Audio(tetrisMusic);
    audioState.audio.loop = true;
    audioState.audio.volume = audioState.volume;
  }
};

export const playBackgroundMusic = () => {
  if (audioState.audio && !audioState.isPlaying) {
    audioState.audio.play();
    audioState.isPlaying = true;
  }
};

export const pauseBackgroundMusic = () => {
  if (audioState.audio && audioState.isPlaying) {
    audioState.audio.pause();
    audioState.isPlaying = false;
  }
};

export const useBackgroundMusic = ({ isPlaying }: { isPlaying: boolean }) => {
  useEffect(() => {
    if (isPlaying) {
      initBackgroundMusic();
      playBackgroundMusic();
    } else {
      pauseBackgroundMusic();
    }
  }, [isPlaying]);
};