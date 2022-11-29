import { useState, useEffect } from 'react';
import { getSession } from 'next-auth/react';
import NProgress from 'nprogress';

import { BigCardLayout, Spinner } from '../../../components/index';
import { useStateContext } from '../../../context/StateContext';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);
  const user = context.req.cookies.currentUser;
  const currentUser = JSON.parse(user);

  if (!session || !currentUser) {
    return {
      redirect: {
        destination: '/',
      },
    };
  }

  return { props: { currentUser } };
};

const Library = ({ currentUser }) => {
  const { isLoading, setIsLoading, getLibrary } = useStateContext();
  const [libraryItems, setLibraryItems] = useState();

  useEffect(() => {
    setIsLoading(true);
    NProgress.start();

    const getAllData = async () => {
      const libraryItemsData = await getLibrary();

      if (libraryItemsData) {
        setLibraryItems(libraryItemsData);
        setIsLoading(false);
        NProgress.done(false);
      }
    };

    getAllData();
  }, []);

  return (
    <>
      {isLoading ? (
        <Spinner />
      ) : (
        <>
          {libraryItems ? (
            <section>
              <h1 className='text-[3rem] font-medium mb-[3rem] text-white'>
                音樂
              </h1>
              <BigCardLayout albums={libraryItems} user={currentUser} />
            </section>
          ) : (
            <h1 className='flex items-center justify-center'>尚未有收藏音樂</h1>
          )}
        </>
      )}
    </>
  );
};

export default Library;
