import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import NProgress from 'nprogress';

import { SmallCardLayout, Spinner } from '../../../components/index';
import useSpotify from '../../../hooks/useSpotify';
import { db, doc, getDoc } from '../../../utils/firebase';
import { useStateContext } from '../../../context/StateContext';

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

  return { props: { currentUser, session, albumId: context.query.albumId } };
};

const Album = ({ currentUser, session, albumId }) => {
  const [album, setAlbum] = useState();
  const { isLoading, setIsLoading } = useStateContext();
  const spotifyApi = useSpotify();

  useEffect(() => {
    setIsLoading(true);
    NProgress.start();
    if (!spotifyApi.getAccessToken()) return;

    const getAllData = async () => {
      const docRef = doc(db, 'library', albumId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const albumData = docSnap.data((data) => data);

        setAlbum(albumData);
      } else {
        const albumData = await spotifyApi
          .getAlbum(albumId)
          .then((data) => data.body);

        albumData.tracks.items.forEach((item, i) => {
          item.album = {
            uri: albumData.uri,
            id: albumData.id,
            total_tracks: albumData.total_tracks,
            offset: {
              id: item.id,
              position: i,
            },
          };
        });

        setAlbum(albumData);
      }

      setIsLoading(false);
      NProgress.done(false);
    };

    getAllData();
  }, [session, spotifyApi]);

  return (
    <>
      {isLoading || !album ? (
        <Spinner />
      ) : (
        <div className='flex flex-col gap-[12rem] w-full px-[3rem] md:px-[8rem] lg:px-[15rem] py-[5rem]'>
          <div className='flex flex-col gap-[2rem] items-center justify-center mt-[5rem] rounded-full'>
            <img
              className='w-[20rem] h-[20rem] rounded-full'
              src={album?.images[1]?.url}
              alt='artist'
            />
            <p className='text-[3.5rem] font-bold text-white'>{album.name}</p>
            {album.artists.map((artist, i) => (
              <div
                className='text-white hover:scale-110 transition-all duration-200 ease-in-out'
                key={artist.name}
              >
                <a
                  href={`/browse/artist/${artist.id}`}
                  className='text-[2.2rem] font-medium'
                >
                  {artist.name}
                </a>
                <span>{i !== album.artists.length - 1 ? ',' : ''}</span>
              </div>
            ))}
          </div>

          <section>
            <SmallCardLayout
              tracks={album.tracks.items}
              layout={'flex'}
              user={currentUser}
              type='album'
              image={album?.images[1]?.url}
              albumId={album.id}
              playlistId=''
            />
          </section>
        </div>
      )}
    </>
  );
};

export default Album;
