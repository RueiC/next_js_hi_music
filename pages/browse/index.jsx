import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import NProgress from 'nprogress';
///////////////////////////
import {
  BigCardLayout,
  SmallCardLayout,
  Spinner,
} from '../../components/index';
import useSpotify from '../../hooks/useSpotify';
import { useStateContext } from '../../context/StateContext';
///////////////////////////

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

  return { props: { currentUser, session } };
};

const Browse = ({ currentUser, session }) => {
  const { isLoading, setIsLoading, getSpotifyPlaylists, getLibrary } =
    useStateContext();
  const [newReleaseAlbums, setNewReleaseAlbums] = useState();
  const [recommendationTracks, setRecommendationTracks] = useState();
  const [featuredPlaylists, setFeaturedPlaylists] = useState();
  const spotifyApi = useSpotify();

  const checkAlbumsIsLiked = async (albums, tracks, libraryItems) => {
    if (libraryItems) {
      albums.forEach((album) => {
        album.isLiked = false;

        libraryItems.map((libraryItem) => {
          if (libraryItem.id === album.id) {
            album.isLiked = true;
          }
        });
      });

      tracks.forEach((track) => {
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
      setNewReleaseAlbums(albums);
      setRecommendationTracks(tracks);
    }
  };

  const checkPlaylistsIsLiked = async (playlists, userStoredPlaylists) => {
    if (userStoredPlaylists) {
      playlists.forEach((playlist) => {
        playlist.isLiked = false;

        userStoredPlaylists.map((item) => {
          if (playlist.id === item.id) {
            playlist.isLiked = true;
          }
        });
      });

      setFeaturedPlaylists(playlists);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    NProgress.start();

    if (!spotifyApi.getAccessToken() || !currentUser) return;

    const getAllData = async () => {
      // Get playlists
      const playlists = await spotifyApi
        .getFeaturedPlaylists({ country: 'US' })
        .then((data) => data.body.playlists.items);

      // Get albums
      const albums = await spotifyApi
        .getNewReleases()
        .then((data) => data.body.albums.items);

      // Get tracks
      const tracks = await spotifyApi
        .getRecommendations({
          min_energy: 0.4,
          seed_artists: ['6mfK6Q2tzLMEchAr0e9Uzu', '4DYFVNKZ1uixa6SQTvzQwJ'],
          min_popularity: 50,
        })
        .then((data) => data.body.tracks);

      // Get library
      const libraryItems = await getLibrary().then((data) => data);

      // Get playlists
      const playlistItems = await getSpotifyPlaylists();

      if (libraryItems) {
        checkAlbumsIsLiked(albums, tracks, libraryItems);
      }

      if (playlistItems) {
        checkPlaylistsIsLiked(playlists, playlistItems);
      }

      setNewReleaseAlbums(albums);
      setRecommendationTracks(tracks);
      setFeaturedPlaylists(playlists);

      setIsLoading(false);
      NProgress.done(false);
    };

    getAllData();
  }, [session, spotifyApi]);

  return (
    <>
      <section className='relative'>
        <div className='absolute z-[0] w-[60%] h-[60%] -right-[40%] rounded-full blue__gradient' />
        <div className='absolute bottom-0 pink__gradient z-[0] w-[40%] h-[35%] opacity-50' />
        <div className='absolute top-0 pink__gradient z-[0] w-[40%] h-[35%] opacity-20' />

        <h1 className='text-[3rem] font-medium mb-[3rem] text-white'>
          最新推出
        </h1>

        {isLoading || !newReleaseAlbums ? (
          <Spinner />
        ) : (
          <BigCardLayout albums={newReleaseAlbums} user={currentUser} />
        )}
      </section>

      <section className='relative flex flex-col gap-[4rem]'>
        <div className='absolute w-full bottom-0 pink__gradient h-[35%] opacity-50' />

        <h1 className='text-[3rem] font-medium mb-[3rem] text-white'>
          推薦給你
        </h1>

        {isLoading || !recommendationTracks ? (
          <Spinner />
        ) : (
          <SmallCardLayout
            tracks={recommendationTracks}
            user={currentUser}
            layout={'grid'}
            image=''
            albumId=''
            playlistId=''
            type='track'
          />
        )}
      </section>

      <section>
        <h1 className='text-[3rem] font-medium mb-[3rem] text-white'>
          推薦播放清單
        </h1>

        {isLoading || !featuredPlaylists ? (
          <Spinner />
        ) : (
          <BigCardLayout playlists={featuredPlaylists} user={currentUser} />
        )}
      </section>
    </>
  );
};

export default Browse;
