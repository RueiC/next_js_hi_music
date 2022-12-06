import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import { RiDeleteBinFill } from 'react-icons/ri';
import NProgress from 'nprogress';
import { useRouter } from 'next/router';

import { SmallCardLayout, Spinner } from '../../../components/index';
import useSpotify from '../../../hooks/useSpotify';
import { useStateContext } from '../../../context/StateContext';
import { db, doc, getDoc, updateDoc, deleteDoc } from '../../../utils/firebase';
import images from '../../../assets/index';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = context.req.cookies.currentUser;
  const type =
    context.query.type === 'user-playlist' ? 'user-playlist' : 'playlist';

  if (!session || !user) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  return {
    props: {
      type,
      session,
      playlistId: context.query.playlistId,
    },
  };
};

const Playlist = ({ session, type, playlistId }) => {
  const {
    isLoading,
    setIsLoading,
    getUserPlaylists,
    getSpotifyPlaylists,
    getLibrary,
  } = useStateContext();
  const [playlist, setPlaylist] = useState([]);
  const [isAddToList, setIsAddToList] = useState(false);
  const [title, setTitle] = useState('');
  const spotifyApi = useSpotify();
  const router = useRouter();

  const deletePlaylist = async () => {
    try {
      await deleteDoc(doc(db, type, playlistId));

      if (type === 'user-playlist') {
        getUserPlaylists();
      }

      if (type === 'playlist') {
        getSpotifyPlaylists();
      }

      router.push('/browse');
    } catch (err) {
      console.log(err);
    }
  };

  const checkIsLiked = async (playlistData, libraryItems) => {
    if (type === 'user-playlist') {
      if (playlistData.tracks.items.length > 0) {
        playlistData.tracks.items.forEach((track) => {
          track.isLiked = false;

          libraryItems.map((libraryItem) => {
            if (libraryItem.id === track.album.id) {
              libraryItem.tracks.items.map((item) => {
                if (item.id === track.id && item.isLiked) {
                  track.isLiked = true;
                }
              });
            }
          });
        });
      }

      setTitle(playlistData.name);
      setPlaylist(playlistData);
    }

    if (type === 'playlist') {
      playlistData.tracks.items.forEach((track) => {
        track.isLiked = false;

        libraryItems.map((libraryItem) => {
          if (libraryItem.id === track.album.id) {
            libraryItem.tracks.items.map((item) => {
              if (item.id === track.id && item.isLiked) {
                track.isLiked = true;
                return;
              }
            });
          }
        });
      });

      setPlaylist(playlistData);
    }

    setIsLoading(false);
    NProgress.done(false);
  };

  useEffect(() => {
    setIsLoading(true);
    NProgress.start();
    if (!spotifyApi.getAccessToken()) return;

    const getAllData = async () => {
      // Get library

      const libraryItems = await getLibrary();

      const playlistRef = doc(db, type, playlistId);
      const playlistSnap = await getDoc(playlistRef);
      if (playlistSnap.exists()) setIsAddToList(true);

      // Get user-playlist
      if (type === 'user-playlist') {
        const docRef = doc(db, 'user-playlist', playlistId);
        const docSnap = await getDoc(docRef);
        const playlistData = docSnap.data();

        if (playlistData && playlistData.tracks.items.length === 0) {
          setIsLoading(false);
          NProgress.done(false);
          setTitle(playlistData.name);
          return;
        }

        if (playlistData && libraryItems) {
          await checkIsLiked(playlistData, libraryItems);
        } else {
          setIsLoading(false);
          NProgress.done(false);
          setPlaylist(playlistData);
          setTitle(playlistData.name);
        }
      }

      // Get Spotify playlist
      if (type === 'playlist') {
        const playlistData = await spotifyApi
          .getPlaylist(playlistId)
          .then((data) => data.body);

        let newPlaylistData = {
          ...playlistData,
          tracks: {
            items: [],
          },
        };

        playlistData.tracks.items.map((item, i) => {
          item.track = {
            ...item.track,
            playlist: {
              id: playlistData.id,
              uri: playlistData.uri,
              offset: {
                id: item.track.id,
                position: i,
              },
            },
          };
          newPlaylistData.tracks.items.push(item.track);
        });

        if (libraryItems) {
          await checkIsLiked(newPlaylistData, libraryItems);
        } else {
          setPlaylist(newPlaylistData);
          setIsLoading(false);
          NProgress.done(false);
        }
      }
    };

    getAllData();
  }, [session, spotifyApi, router]);

  const updateTitle = async (playlistId, title) => {
    const docRef = doc(db, type, playlistId);

    await updateDoc(docRef, {
      name: title,
    });
  };

  return (
    <>
      {isLoading || !playlist ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-[12rem] w-full px-[3rem] md:px-[8rem] lg:px-[15rem] py-[5rem]'>
          <div className='flex flex-col gap-[2rem] items-center justify-center mt-[5rem] rounded-full'>
            <img
              className='w-[20rem] h-[20rem] rounded-full'
              src={
                type === 'playlist' ? playlist?.images?.[0]?.url : images.album
              }
              alt='artist'
              loading='lazy'
            />

            {type === 'user-playlist' ? (
              <form
                className='flex items-center justify-center'
                onSubmit={(e) => {
                  e.preventDefault();
                  updateTitle(playlistId, title);
                }}
              >
                <input
                  className='text-[3.5rem] font-bold text-white text-center outline-none bg-transparent'
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </form>
            ) : (
              <div>
                <p className='text-[3.5rem] font-bold text-white text-center mb-[1rem]'>
                  {playlist.name}
                </p>
                <p className='text-[2rem] text-white opacity-80'>
                  {playlist.description}
                </p>
              </div>
            )}

            {isAddToList ? (
              <div className='bg-blue-gradient p-[1.2rem] rounded-full opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer'>
                <RiDeleteBinFill
                  className='text-white text-[3rem]'
                  onClick={() => deletePlaylist(playlist, type)}
                />
              </div>
            ) : null}
          </div>
          {playlist?.tracks?.items.length > 0 ? (
            <section>
              <SmallCardLayout
                tracks={playlist.tracks.items}
                layout={'flex'}
                image=''
                albumId=''
                type={type === 'playlist' ? type : 'track'}
              />
            </section>
          ) : (
            <h1 className='flex items-center justify-center text-white text-[3rem] font-medium'>
              播放清單中尚未有歌曲
            </h1>
          )}
        </div>
      )}
    </>
  );
};

export default Playlist;
