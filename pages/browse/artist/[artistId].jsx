import { useState, useEffect } from "react";
import { getSession } from "next-auth/react";
import { toast } from "react-toastify";
import NProgress from "nprogress";

import { BigCardLayout, Spinner } from "../../../components/index";
import useSpotify from "../../../hooks/useSpotify";
import { useStateContext } from "../../../context/StateContext";

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = context.req.cookies.currentUser;

  if (!session || !user) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }

  const currentUser = JSON.parse(user);

  return { props: { currentUser, session, artistId: context.query.artistId } };
};

const Artist = ({ currentUser, session, artistId }) => {
  const [artist, setArtist] = useState();
  const [artistAlbums, setArtistAlbums] = useState();
  const { isLoading, setIsLoading, getLibrary } = useStateContext();
  const spotifyApi = useSpotify();

  const checkIsLiked = async (artistAlbumsData, libraryItems) => {
    artistAlbumsData.forEach((album) => {
      album.isLiked = false;

      libraryItems.map((libraryItem) => {
        if (libraryItem.id === album.id) {
          album.isLiked = true;
        }
      });
    });

    setArtistAlbums(artistAlbumsData);
    setIsLoading(false);
    NProgress.done(false);
  };

  useEffect(() => {
    setIsLoading(true);
    NProgress.start();
    if (!spotifyApi.getAccessToken()) return;

    const getAllData = async () => {
      // Get library
      const libraryItems = getLibrary();

      // Get artist
      const artistData = await spotifyApi
        .getArtist(artistId)
        .then((data) => data.body);

      // Get artist albums
      const artistAlbumsData = await spotifyApi
        .getArtistAlbums(artistId)
        .then((data) => data.body.items);

      setArtist(artistData);

      if (libraryItems) {
        checkIsLiked(artistAlbumsData, libraryItems);
      } else {
        setArtistAlbums(artistAlbumsData);
      }
    };

    getAllData();
  }, [session, spotifyApi]);

  useEffect(() => {
    setTimeout(() => {
      if (!artist || !artistAlbums)
        toast("載入失敗，請重新操作", { type: "error" });
    }, 8000);
  }, []);

  return (
    <>
      {isLoading || !artist ? (
        <Spinner />
      ) : (
        <div className="flex flex-col gap-[12rem] w-full px-[3rem] md:px-[8rem] lg:px-[15rem] py-[5rem]">
          <div className="flex flex-col gap-[2rem] items-center justify-center mt-[5rem] rounded-full">
            <img
              className="w-[20rem] h-[20rem] rounded-full"
              src={artist?.images[1] ? artist.images[1].url : ""}
              alt="artist"
            />
            <p className="text-[3.5rem] font-bold text-white">{artist.name}</p>
          </div>

          <section>
            <h1 className="text-[3rem] font-medium mb-[3rem] text-white">
              音樂作品
            </h1>

            <BigCardLayout albums={artistAlbums} user={currentUser} />
          </section>
        </div>
      )}
    </>
  );
};

export default Artist;
