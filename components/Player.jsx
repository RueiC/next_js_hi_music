import { useState, useEffect } from 'react';
import {
  AiOutlineHeart,
  AiFillHeart,
  AiFillPlayCircle,
  AiFillPauseCircle,
} from 'react-icons/ai';
import { BiSkipPrevious, BiSkipNext } from 'react-icons/bi';
import { BsFillVolumeUpFill, BsFillVolumeMuteFill } from 'react-icons/bs';
import { toast } from 'react-toastify';
///////////////////////////
import {
  db,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  auth,
  onAuthStateChanged,
} from '../utils/firebase';
import useSpotify from '../hooks/useSpotify';
import { useStateContext } from '../context/StateContext';

const Player = () => {
  const spotifyApi = useSpotify();
  // const [isLiked, setIsLiked] = useState(false);
  const [position, setPosition] = useState('0:00');
  const [progress, setProgress] = useState(0);
  const [volumn, setVolumn] = useState(100);
  const [isMuted, setIsMuted] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [time, setTime] = useState(0);
  const [currentUser, setCurrentUser] = useState(null);
  const {
    currentTrack,
    currentTrackIsLiked,
    isPlaying,
    setIsPlaying,
    duration,
    currentUriData,
    calcDuration,
    deviceId,
    setCurrentTrackIsLiked,
  } = useStateContext();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) setCurrentUser(user);
      else setCurrentUser(null);
    });
  }, []);

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
          setProgress(((prevTime + 1000) / duration) * 100);
          return prevTime + 1000;
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  useEffect(() => {
    if (currentUriData === null) return;
    setTime(0);
    setPosition('0:00');
  }, [currentUriData]);

  useEffect(() => {
    if (!currentUriData || !currentTrack) return;

    const checkIsLiked = async () => {
      if (currentUriData.type !== 'playlist') {
        const docRef = doc(db, 'library', currentUriData.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const albumData = docSnap.data();
          albumData.tracks.items.map((item) => {
            if (item.id === currentTrack.id) {
              // setIsLiked(true);
              setCurrentTrackIsLiked(true);
            }
          });
        } else {
          // setIsLiked(false);
          setCurrentTrackIsLiked(false);
        }
        return;
      }

      if (currentUriData.type === 'playlist') {
        const newTrack = await spotifyApi
          .getTrack(currentTrack.id)
          .then((data) => data.body);

        const docRef = doc(db, 'library', newTrack.album.id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const albumData = docSnap.data();
          albumData.tracks.items.map((item) => {
            if (item.id === currentTrack.id) {
              // setIsLiked(true);
              setCurrentTrackIsLiked(true);
            }
          });
        } else {
          // setIsLiked(false);
          setCurrentTrackIsLiked(false);
        }
        return;
      }
    };

    checkIsLiked();
  }, [currentUriData, currentTrack]);

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
    setPosition('0:00');
    await spotifyApi.skipToPrevious();
  };

  const nextSong = async () => {
    setTime(0);
    setPosition('0:00');
    await spotifyApi.skipToNext();
  };

  const handleLike = async () => {
    let trackInfo = {};

    if (currentUriData.type === 'playlist') {
      const trackRes = await spotifyApi
        .getTrack(currentTrack.id)
        .then((data) => data.body);

      trackInfo.type = 'playlist';
      trackInfo.id = trackRes.album.id;
    } else {
      trackInfo = currentUriData;
    }

    const docRef = doc(db, 'library', trackInfo.id);
    const docSnap = await getDoc(docRef);

    if (currentTrackIsLiked) {
      const newAlbum = docSnap.data();

      newAlbum.tracks.items.forEach((item) => {
        if (item.id === currentTrack.id) item.isLiked = false;
      });

      await updateDoc(docRef, {
        tracks: {
          items: newAlbum.tracks.items,
        },
      });

      toast('已從資料庫中移除', { type: 'success' });
      setCurrentTrackIsLiked(false);
      return;
    }

    if (!currentTrackIsLiked) {
      if (docSnap.exists()) {
        const newAlbum = docSnap.data();

        newAlbum.tracks.items.forEach((item) => {
          if (item.id === currentTrack.id) item.isLiked = true;
        });

        await updateDoc(docRef, {
          tracks: {
            items: newAlbum.tracks.items,
          },
        });
      } else {
        const newAlbum = await spotifyApi
          .getAlbum(trackInfo.id)
          .then((data) => data.body);

        newAlbum.tracks.items.forEach((item) => {
          item.isLiked = false;
          if (item.id === currentTrack.id) item.isLiked = true;
        });

        await setDoc(doc(db, 'library', trackInfo.id), {
          ...newAlbum,
          userId: currentUser.uid,
          isLiked: true,
        });
      }
      toast('已新增至資料庫', { type: 'success' });
      setCurrentTrackIsLiked(true);
    }
  };

  const likeIcon = currentTrackIsLiked ? (
    <AiFillHeart
      className='transition-all duration-200 ease-in-out shadow-2xl cursor-pointer hover:scale-110 opacity-80 hover:opacity-100'
      onClick={handleLike}
    />
  ) : (
    <AiOutlineHeart
      className='transition-all duration-200 ease-in-out shadow-2xl cursor-pointer hover:scale-110 opacity-80 hover:opacity-100'
      onClick={handleLike}
    />
  );

  return (
    <>
      {currentTrack && (
        <div className='fixed flex items-center justify-between gap-[6rem] px-[5rem] w-full h-[12rem] bottom-0 bg-black-gradient z-50'>
          <div className='flex items-center justify-between w-[70rem]'>
            <div className='flex items-center gap-[2rem]'>
              <img
                className='w-[7rem] h-[7rem] rounded-[1rem] cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out'
                src={currentTrack?.album?.images?.[0]?.url}
                alt=''
              />
              <div className='text-white'>
                <p className='text-[2.2rem] font-medium cursor-pointer hover:opacity-100 transition-all duration-300 ease-in-out opacity-80'>
                  {currentTrack?.name}
                </p>
                <p className='text-[1.5rem] cursor-pointer hover:opacity-100 transition-all duration-300 ease-in-out opacity-80'>
                  {currentTrack?.artists?.[0]?.name}
                </p>
              </div>
            </div>
            <div className='text-white text-[3rem]'>{likeIcon}</div>
          </div>

          <div className='flex items-center justify-center text-[5rem] text-white'>
            <BiSkipPrevious
              className='transition-all duration-300 ease-in-out cursor-pointer hover:scale-110 hover:opacity-100 opacity-80'
              onClick={prevSong}
            />

            {isPlaying ? (
              <AiFillPauseCircle
                className='transition-all duration-300 ease-in-out cursor-pointer hover:scale-110 hover:opacity-100 opacity-80'
                onClick={handlePlayAndPause}
              />
            ) : (
              <AiFillPlayCircle
                className='transition-all duration-300 ease-in-out cursor-pointer hover:scale-110 hover:opacity-100 opacity-80'
                onClick={handlePlayAndPause}
              />
            )}

            <BiSkipNext
              className='transition-all duration-300 ease-in-out cursor-pointer hover:scale-110 hover:opacity-100 opacity-80'
              onClick={nextSong}
            />
          </div>

          <div className='flex items-center justify-center gap-[2rem] w-full'>
            <span className='font-medium text-white'>
              {!position ? '0:00' : position}
            </span>
            <div
              className='w-full h-[5px] rounded-full bg-white/90'
              onClick={seek}
            >
              <div
                className='h-[5px] rounded-full bg-blue-gradient transition-all ease-linear'
                style={{ width: progress + '%' }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
            <span className='font-medium text-white'>
              {!duration ? '' : calcDuration(duration)}
            </span>
          </div>

          <div className='flex items-center justify-center w-[25%] gap-[2rem]'>
            {!isMuted ? (
              <BsFillVolumeUpFill
                className='text-[3rem] text-white cursor-pointer hover:scale-110 hover:opacity-100 transition-all duration-300 ease-in-out opacity-80'
                onClick={() => setIsMuted(true)}
              />
            ) : (
              <BsFillVolumeMuteFill
                className='text-[3rem] text-white cursor-pointer hover:scale-110 hover:opacity-100 transition-all duration-300 ease-in-out opacity-80'
                onClick={() => setIsMuted(false)}
              />
            )}

            <div className='relative w-full h-[5px] rounded-full bg-white/90'>
              <div
                className='h-[5px] rounded-full bg-blue-gradient transition-all ease-linear'
                style={{ width: isMuted ? 0 : volumn + '%' }}
                onClick={(e) => e.stopPropagation()}
              />
              <div
                className='absolute top-0 left-0 w-full h-[5px] rounded-full bg-white/0'
                onClick={controlVolumn}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Player;
