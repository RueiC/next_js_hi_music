/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react';
import { BsMusicNoteList } from 'react-icons/bs';
import {
  AiOutlineHeart,
  AiFillHeart,
  AiFillPlayCircle,
  AiFillPauseCircle,
} from 'react-icons/ai';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

import { db, doc, getDoc, updateDoc, setDoc } from '../utils/firebase';
import useSpotify from '../hooks/useSpotify';
import { useStateContext } from '../context/StateContext';

const SmallCard = ({ user, track, image, albumId, playlistId, type }) => {
  const {
    currentTrack,
    currentTrackIsLiked,
    currentUriData,
    setCurrentUriData,
    isPlaying,
    userPlaylists,
    setCurrentTrackIsLiked,
  } = useStateContext();
  const [cardHovered, setCardHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(track?.isLiked);
  const [togglePlayBtn, setTogglePlayBtn] = useState(false);
  const [openOptions, setOpenOptions] = useState(false);
  const [albumImage, setAlbumImage] = useState(image);
  const spotifyApi = useSpotify();

  useEffect(() => {
    if (!albumImage) getAlbumImage();
  }, []);

  useEffect(() => {
    if (!currentTrack || !currentUriData) return;

    let uriData;
    if (type === 'album') {
      uriData = {
        ...track.album,
        type,
      };
    }
    if (type === 'playlist') {
      uriData = {
        ...track.playlist,
        type,
      };
    }
    if (type === 'track') {
      uriData = {
        id: track.album.id,
        uri: track.album.uri,
        offset: { position: track.track_number - 1 },
        type: 'album',
      };
    }

    if (uriData.uri !== currentUriData.uri && type === 'track') {
      setTogglePlayBtn(false);
    }

    if (uriData?.offset?.id !== currentTrack.id && type !== 'track') {
      setTogglePlayBtn(false);
    }

    if (isPlaying === null) return;
    if (isPlaying === false) setTogglePlayBtn(false);

    if (isPlaying) {
      if (uriData.uri === currentUriData.uri && type === 'track') {
        setTogglePlayBtn(true);
      }
      if (uriData?.offset?.id === currentTrack.id && type !== 'track') {
        setTogglePlayBtn(true);
      }
    }
  }, [currentTrack, currentUriData, isPlaying]);

  useEffect(() => {
    if (currentTrack === null || !currentTrack) return;

    if (currentTrack.id === track.id) {
      setIsLiked(currentTrackIsLiked);
    }
  }, [currentTrackIsLiked]);

  const pauseSong = async () => {
    await spotifyApi.pause();
    setTogglePlayBtn(false);
  };

  const playTrack = async () => {
    let uriData;
    if (type === 'album') {
      uriData = {
        ...track.album,
        type,
      };
    }
    if (type === 'playlist') {
      uriData = {
        ...track.playlist,
        type,
      };
    }
    if (type === 'track')
      uriData = {
        id: track.album.id,
        uri: track.album.uri,
        type,
        offset: { position: track.track_number - 1 },
      };

    if (
      currentTrack === null ||
      (uriData.uri !== currentUriData.uri && type === 'track')
    ) {
      setCurrentUriData(uriData);
    } else if (uriData.offset.id !== currentTrack.id && type !== 'track') {
      setCurrentUriData(uriData);
    } else {
      await spotifyApi.play();
    }

    setTogglePlayBtn(true);
  };

  const getAlbumImage = async () => {
    const albumData = await spotifyApi
      .getAlbum(track.album.id)
      .then((data) => data.body);

    setAlbumImage(albumData?.images[1]?.url);
  };

  const calcDuration = (ms) => {
    const min = Math.floor(ms / 60000);
    const sec = Math.round((ms % 60000) / 1000);

    return sec === 60
      ? `${min + 1}:00`
      : `${min}:${sec.toString().padStart(2, '0')}`;
  };

  const handleLike = async () => {
    const docRef = doc(db, 'library', albumId ? albumId : track.album.id);
    const docSnap = await getDoc(docRef);

    if (isLiked) {
      const newAlbum = docSnap.data();

      newAlbum.tracks.items.forEach((item) => {
        if (item.id === track.id) item.isLiked = false;
      });

      await updateDoc(docRef, {
        tracks: {
          items: newAlbum.tracks.items,
        },
      });

      if (track.id === currentTrack.id) {
        setCurrentTrackIsLiked(false);
      }

      setIsLiked(false);
      toast('已從資料庫中移除', { type: 'success' });
      return;
    }

    if (!isLiked) {
      if (docSnap.exists()) {
        const newAlbum = docSnap.data();

        newAlbum.tracks.items.forEach((item) => {
          if (item.id === track.id) item.isLiked = true;
        });

        await updateDoc(docRef, {
          tracks: {
            items: newAlbum.tracks.items,
          },
        });
      } else {
        const newAlbum = await spotifyApi
          .getAlbum(albumId ? albumId : track.album.id)
          .then((data) => data.body);

        newAlbum.tracks.items.forEach((item) => {
          item.isLiked = false;
          if (item.id === track.id) item.isLiked = true;
        });

        await setDoc(doc(db, 'library', newAlbum.id), newAlbum);
      }

      if (track.id === currentTrack.id) {
        setCurrentTrackIsLiked(true);
      }

      setIsLiked(true);
      toast('已新增至資料庫', { type: 'success' });
    }
  };

  const addTrackToUserPlaylist = async (userPlaylist, track) => {
    let newTrack;
    const docRef = doc(db, userPlaylist.type, userPlaylist.id);
    const docSnap = await getDoc(docRef);
    const playlist = docSnap.data();

    if (track?.album) {
      newTrack = track;
    } else {
      const trackData = await spotifyApi
        .getTrack(track.id)
        .then((data) => data.body);

      newTrack = trackData;
    }

    await updateDoc(docRef, {
      tracks: {
        items: [...playlist.tracks.items, newTrack],
      },
    });

    setOpenOptions((prevState) => !prevState);
  };

  const likeIcon = isLiked ? (
    <AiFillHeart
      className='block text-[2.5rem] hover:scale-110 transition-all duration-200 ease-in-out opacity-80 hover:opacity-100 cursor-pointer'
      onClick={handleLike}
    />
  ) : (
    <AiOutlineHeart
      className='block text-[2.5rem] hover:scale-110 transition-all duration-200 ease-in-out opacity-80 hover:opacity-100 cursor-pointer'
      onClick={handleLike}
    />
  );

  return (
    <>
      {track && (
        <m.div
          className={`${
            cardHovered ? 'bg-blue-gradient' : 'bg-black-gradient'
          } ${
            openOptions && 'z-50'
          } relative flex items-center justify-between px-[3rem] py-[1.5rem] rounded-[1rem] hover:-translate-y-3 transition-all duration-500 ease-in-out`}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          whileInView={{ opacity: [0, 1], y: [100, 0] }}
          transition={{ duration: 0.4, delayChildren: 0.3 }}
          key={track.id}
        >
          <div className='flex items-center gap-[2rem]'>
            <div className='relative'>
              {albumImage && (
                <Image
                  className={`${
                    cardHovered && 'brightness-[0.4]'
                  } w-[7rem] h-[7rem] rounded-[1rem] block`}
                  src={albumImage}
                  blurDataURL={albumImage}
                  alt='album'
                  width={640}
                  height={640}
                  sizes={640}
                  placeholder='blue'
                />
              )}

              {cardHovered && (
                <div className='absolute top-[2rem] left-[2rem] text-white text-[3rem]'>
                  {togglePlayBtn ? (
                    <AiFillPauseCircle
                      className='mr-[3.5rem] hover:scale-110 transition-all duration-200 ease-in-out shadow-2xl opacity-80 hover:opacity-100 cursor-pointer'
                      onClick={pauseSong}
                    />
                  ) : (
                    <AiFillPlayCircle
                      className='mr-[3.5rem] hover:scale-110 transition-all duration-200 ease-in-out shadow-2xl opacity-80 hover:opacity-100 cursor-pointer'
                      onClick={playTrack}
                    />
                  )}
                </div>
              )}
            </div>
            <div className='flex flex-col flex-1 text-white'>
              <Link
                href={`/browse/album/${albumId ? albumId : track.album.id}`}
                className='text-[2rem] font-bold opacity-80 hover:opacity-100 transition-all duration-200 ease-in-out'
              >
                {track.name}
              </Link>
              {track.artists.map((artist, i) => (
                <Link
                  href={`/browse/artist/${artist.id}`}
                  className='text-[1.5rem] font-medium opacity-80 hover:opacity-100 transition-all duration-200 ease-in-out'
                  key={artist.name}
                >
                  {artist.name}
                  <span>{i !== track.artists.length - 1 ? ',' : ''}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className='flex items-center gap-[2.5rem] text-white'>
            <p className='text-[1.8rem]'>{calcDuration(track.duration_ms)}</p>
            {likeIcon}

            <BsMusicNoteList
              className='block text-[2.5rem] hover:scale-110 transition-all duration-200 ease-in-out opacity-80 hover:opacity-100 cursor-pointer'
              onClick={() => setOpenOptions((prevState) => !prevState)}
            />
          </div>

          {openOptions && (
            <div className='absolute top-[10rem] right-0'>
              <ul className='flex flex-col bg-white rounded-[1rem] w-[15rem] overflow-hidden'>
                {userPlaylists &&
                  userPlaylists.map((userPlaylist) => (
                    <li
                      className='text-black px-[2.5rem] py-[2rem] hover:bg-tertiary hover:text-white cursor-pointer'
                      key={userPlaylist.id}
                      onClick={async () =>
                        addTrackToUserPlaylist(userPlaylist, track)
                      }
                    >
                      {userPlaylist.name}
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </m.div>
      )}
    </>
  );
};

export default SmallCard;
