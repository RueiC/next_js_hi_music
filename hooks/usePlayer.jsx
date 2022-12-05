import { useState, useEffect } from 'react';
import { useStateContext } from '../context/StateContext';
import useSpotify from './useSpotify';

const usePlayer = (isMuted) => {
  const spotifyApi = useSpotify();
  const [position, setPosition] = useState('0:00');
  const [progress, setProgress] = useState(0);
  const [volumn, setVolumn] = useState(100);
  // eslint-disable-next-line no-unused-vars
  const [time, setTime] = useState(0);
  const {
    currentTrack,
    isPlaying,
    setIsPlaying,
    duration,
    currentUriData,
    calcDuration,
    deviceId,
  } = useStateContext();

  useEffect(() => {
    if (isPlaying === null || !currentTrack) return;
    if (position === duration) {
      clearInterval(interval);
      return;
    }

    const interval = setInterval(() => {
      if (isPlaying) {
        setTime((prevTime) => {
          setPosition(calcDuration(prevTime + 1000));
          setProgress(Math.floor(((prevTime + 1000) / duration) * 100));
          return prevTime + 1000;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, duration]);

  useEffect(() => {
    if (currentUriData === null) return;
    setTime(0);
    setProgress(0);
    setPosition('0:00');
  }, [currentUriData]);

  useEffect(() => {
    if (!spotifyApi || !deviceId || !volumn) return;

    const toggleMuted = async (volumn) => {
      await spotifyApi.setVolume(volumn, { device_id: deviceId }).then(
        () => {},
        (err) => console.log('Something went wrong!', err),
      );
    };

    if (isMuted) {
      toggleMuted(0);
    }

    if (!isMuted) {
      toggleMuted(volumn);
    }

    toggleMuted(volumn);
  }, [isMuted, spotifyApi, deviceId]);

  const handlePlayAndPause = async () => {
    if (isPlaying) {
      spotifyApi.pause();
      setIsPlaying(false);
    } else {
      spotifyApi.play();
      setIsPlaying(true);
    }
  };

  const seek = async (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const progressPercentage = x / rect.width;
    const positionMs = Math.floor(duration * progressPercentage);

    await spotifyApi.seek(positionMs).then(
      () => {
        setTime(positionMs);
        setProgress(Math.floor(progressPercentage * 100));
        setPosition(calcDuration(positionMs));
      },

      (err) => console.log('Something went wrong!', err),
    );
  };

  const controlVolumn = async (e) => {
    const rect = e.target.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const volumnPercentage = Math.floor((x / rect.width) * 100);

    await spotifyApi.setVolume(volumnPercentage).then(
      () => setVolumn(volumnPercentage),
      (err) => console.log('Something went wrong!', err),
    );
  };

  const prevSong = async () => {
    setTime(0);
    setProgress(0);
    setPosition('0:00');
    await spotifyApi.skipToPrevious();
  };

  const nextSong = async () => {
    setTime(0);
    setProgress(0);
    setPosition('0:00');
    await spotifyApi.skipToNext();
  };

  return {
    progress,
    position,
    volumn,
    handlePlayAndPause,
    seek,
    controlVolumn,
    prevSong,
    nextSong,
  };
};

export default usePlayer;
