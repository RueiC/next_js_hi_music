import { useEffect, useState } from 'react';
import { getSession } from 'next-auth/react';
import NProgress from 'nprogress';

import { BigCardLayout, Spinner } from '../../../components/index';
import useSpotify from '../../../hooks/useSpotify';
import { useStateContext } from '../../../context/StateContext';
import { useSession } from 'next-auth/react';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = context.req.cookies.currentUser;

  if (!session || !user) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }
  const currentUser = JSON.parse(user);

  return { props: { searchId: context.query.searchId, currentUser } };
};

const Search = ({ searchId, currentUser }) => {
  const [artists, setArtists] = useState();
  const [albums, setAlbums] = useState();
  const [playlists, setPlaylists] = useState();
  const { isLoading, setIsLoading, getLibrary, getSpotifyPlaylists } =
    useStateContext();
  const spotifyApi = useSpotify();
  const { data: session } = useSession();

  const checkAlbumsIsLiked = async (albums, libraryItems) => {
    albums.forEach((album) => {
      album.isLiked = false;

      libraryItems.map((libraryItem) => {
        if (libraryItem.id === album.id) {
          album.isLiked = true;
        }
      });
    });

    setAlbums(albums);
  };

  const checkPlaylistsIsLiked = async (playlists, playlistItems) => {
    playlists.forEach((playlist) => {
      playlist.isLiked = false;

      playlistItems.map((item) => {
        if (playlist.id === item.id) {
          playlist.isLiked = true;
        }
      });
    });

    setPlaylists(playlists);
  };

  useEffect(() => {
    setIsLoading(true);
    NProgress.start();
    if (!searchId || !spotifyApi || !session) return;

    const getSearchResult = async () => {
      const libraryItems = await getLibrary().then((data) => data);
      const playlistItems = await getSpotifyPlaylists();

      const searchRes = await fetch(
        `https://api.spotify.com/v1/search?q=${searchId}&type=album,artist,playlist`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${session.user.accessToken}`,
          },
        },
      ).then((data) => data.json());
      setArtists(searchRes.artists.items);

      if (libraryItems) {
        checkAlbumsIsLiked(searchRes.albums.items, libraryItems);
      } else {
        setAlbums(searchRes.albums.items);
      }

      if (playlistItems) {
        checkPlaylistsIsLiked(searchRes.playlists.items, playlistItems);
      } else {
        setPlaylists(searchRes.playlists.items);
      }

      setIsLoading(false);
      NProgress.done(false);
    };

    getSearchResult();
  }, [searchId, spotifyApi, session]);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-[12rem] w-full px-[8rem] py-[5rem]'>
          <h1 className='text-[5rem] font-bold text-white'>搜尋結果</h1>

          <h1 className='text-[3rem] font-medium mb-[3rem] text-white'>藝人</h1>
          <div className='flex items-center justify-start flex-wrap gap-[5rem] w-full'>
            {artists &&
              artists.map((artist) => (
                <a
                  className='flex flex-col items-center justify-center w-[15rem] h-[15rem] text-center'
                  href={`/browse/artist/${artist.id}`}
                  key={artist.id}
                >
                  <img
                    className='w-[10rem] h-[10rem] mb-[2rem] rounded-full hover:scale-105 transition-all duration-300 ease-in-out'
                    src={artist?.images[1]?.url}
                    alt=''
                  />
                  <p className='text-white text-[2rem] font-bold opacity-90 hover:opacity-100 transition-all duration-300 ease-in-out'>
                    {artist.name}
                  </p>
                </a>
              ))}
          </div>

          <h1 className='text-[3rem] font-medium mb-[3rem] text-white'>專輯</h1>
          {albums && <BigCardLayout albums={albums} user={currentUser} />}

          <h1 className='text-[3rem] font-medium mb-[3rem] text-white'>
            播放清單
          </h1>
          {playlists && (
            <BigCardLayout playlists={playlists} user={currentUser} />
          )}
        </div>
      )}
    </>
  );
};

export default Search;
