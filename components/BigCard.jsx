import { useState, useEffect } from 'react';
import {
  AiFillPlayCircle,
  AiOutlineHeart,
  AiFillHeart,
  AiFillPauseCircle,
} from 'react-icons/ai';
import { m } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { toast } from 'react-toastify';

import {
  db,
  doc,
  setDoc,
  deleteDoc,
  getDoc,
  updateDoc,
} from '../utils/firebase';
import useSpotify from '../hooks/useSpotify';
import { useStateContext } from '../context/StateContext';

const BigCard = ({ user, item }) => {
  const [cardHovered, setCardHovered] = useState(false);
  const [isLiked, setIsLiked] = useState(item?.isLiked);
  const [togglePlayBtn, setTogglePlayBtn] = useState(false);
  const spotifyApi = useSpotify();
  const {
    currentTrack,
    currentUriData,
    isPlaying,
    getSpotifyPlaylists,
    setCurrentUriData,
  } = useStateContext();

  useEffect(() => {
    if (!currentTrack || !currentUriData) return;
    if (item.uri !== currentUriData.uri) setTogglePlayBtn(false);

    if (isPlaying === null) return;
    if (isPlaying === false) setTogglePlayBtn(false);
    if (isPlaying === true && item.uri === currentUriData.uri)
      setTogglePlayBtn(true);
  }, [currentTrack, currentUriData, isPlaying]);

  const pauseSong = async () => {
    await spotifyApi.pause();
    setTogglePlayBtn(false);
  };

  const playAlbumOrPlaylist = async () => {
    if (currentTrack === null || item.uri !== currentUriData.uri)
      setCurrentUriData({
        id: item.id,
        uri: item.uri,
        offset: null,
        type: item.type,
      });
    else await spotifyApi.play();

    setTogglePlayBtn(true);
  };

  const handleLike = async () => {
    if (isLiked) {
      await deleteDoc(
        doc(db, item.type === 'playlist' ? item.type : 'library', item.id),
      );

      setIsLiked(false);

      if (item.type === 'playlist') {
        await getSpotifyPlaylists();
      }

      toast('已從資料庫中移除', { type: 'success' });
      return;
    }

    if (!isLiked) {
      if (item.type === 'playlist') {
        await setDoc(doc(db, item.type, item.id), {
          ...item,
          userId: user.uid,
          isLiked: true,
        });

        setIsLiked(true);

        await getSpotifyPlaylists();
      }

      if (item.type === 'album') {
        const docRef = doc(db, 'library', item.id);
        const docSnap = await getDoc(docRef);

        const newAlbum = await spotifyApi
          .getAlbum(item.id)
          .then((data) => data.body);

        if (docSnap.exists()) {
          await updateDoc(docRef, {
            isLiked: true,
          });
        } else {
          newAlbum.tracks.items = await setDoc(
            doc(db, 'library', newAlbum.id),
            {
              ...newAlbum,
              userId: user.uid,
              isLiked: true,
            },
          );
        }

        setIsLiked(true);
      }

      toast('已新增至資料庫', { type: 'success' });
    }
  };

  const likeIcon = isLiked ? (
    <AiFillHeart
      className='hover:scale-110 transition-all duration-200 ease-in-out shadow-2xl opacity-80 hover:opacity-100 cursor-pointer'
      onClick={handleLike}
    />
  ) : (
    <AiOutlineHeart
      className='hover:scale-110 transition-all duration-200 ease-in-out shadow-2xl opacity-80 hover:opacity-100 cursor-pointer'
      onClick={handleLike}
    />
  );

  return (
    <>
      {item && (
        <m.div
          className={`${
            cardHovered ? 'bg-blue-gradient' : 'bg-black-gradient'
          } w-full xl:w-[90%] rounded-[1rem] hover:-translate-y-3 transition-all duration-500 ease-in-out z-[1]`}
          onMouseEnter={() => setCardHovered(true)}
          onMouseLeave={() => setCardHovered(false)}
          whileInView={{ opacity: [0, 1], y: [100, 0] }}
          transition={{ duration: 0.4, delayChildren: 0.3 }}
          key={item.id}
        >
          <div className='flex flex-col p-[2rem] gap-[2rem]'>
            <div className='relative'>
              <Image
                className={`${
                  cardHovered && 'brightness-50'
                } rounded-[1rem] block object-fill`}
                src={
                  item.type === 'album'
                    ? item.images[1].url
                    : item?.images[0]?.url
                }
                blurDataURL={
                  item.type === 'album'
                    ? item.images[1].url
                    : item?.images[0]?.url
                }
                alt='image'
                width={640}
                height={640}
                sizes={640}
                placeholder='blue'
              />

              {cardHovered && (
                <div className='absolute w-full flex items-center justify-between bottom-0 px-[2.2rem] py-[2.2rem] text-white text-[3rem]'>
                  {likeIcon}

                  {togglePlayBtn ? (
                    <AiFillPauseCircle
                      className='hover:scale-110 transition-all duration-200 ease-in-out shadow-2xl opacity-80 hover:opacity-100 cursor-pointer'
                      onClick={pauseSong}
                    />
                  ) : (
                    <AiFillPlayCircle
                      className='hover:scale-110 transition-all duration-200 ease-in-out shadow-2xl opacity-80 hover:opacity-100 cursor-pointer'
                      onClick={playAlbumOrPlaylist}
                    />
                  )}
                </div>
              )}
            </div>

            <div className='flex flex-col gap-2 text-white'>
              <Link
                href={`/browse/${item.type}/${item.id}`}
                className='text-[2rem] font-bold opacity-80 hover:opacity-100 transition-all duration-200 ease-in-out'
              >
                {item?.name}
              </Link>
              {item.type !== 'playlist' ? (
                item.artists.map((artist, i) => (
                  <div key={artist.name}>
                    <Link
                      href={`/browse/artist/${artist.id}`}
                      className='text-[1.5rem] font-medium opacity-80 hover:opacity-100 transition-all duration-200 ease-in-out'
                    >
                      {artist.name}
                    </Link>
                    <span>{i !== item.artists.length - 1 ? ',' : ''}</span>
                  </div>
                ))
              ) : (
                <p>{item.description}</p>
              )}
            </div>
          </div>
        </m.div>
      )}
    </>
  );
};

export default BigCard;
