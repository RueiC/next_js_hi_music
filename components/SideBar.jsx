import { useState, useEffect } from 'react';
import { AiFillHome, AiFillCloseCircle, AiOutlineMenu } from 'react-icons/ai';
import { MdLibraryMusic } from 'react-icons/md';
import { RiPlayListFill } from 'react-icons/ri';
import { IoIosAddCircle } from 'react-icons/io';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { signOut as spotifySignOut } from 'next-auth/react';
import { useRouter } from 'next/router';

import images from '../assets/index';
import { db, doc, setDoc, auth, onAuthStateChanged } from '../utils/firebase';
import { useStateContext } from '../context/StateContext';

const SideBar = () => {
  const {
    firebaseSignOut,
    userPlaylists,
    getUserPlaylists,
    spotifyPlaylists,
    getSpotifyPlaylists,
  } = useStateContext();
  const [currentUser, setCurrentUser] = useState();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSidebar, setShowSidebar] = useState(false);
  const [sticky, setSticky] = useState('');
  const router = useRouter();

  const signOut = () => {
    firebaseSignOut();
    spotifySignOut();
    router.push('/');
  };

  useEffect(() => {
    if (router.route === '/') return;
    if (router.route !== '/') {
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setCurrentUser(user);
          getUserPlaylists();
          getSpotifyPlaylists();
        } else {
          setCurrentUser(null);
        }
      });
    }
  }, [router.route]);

  useEffect(() => {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 250)
        setSticky(
          'fixed top-0 left-0 right-0 w-full z-50 border-b-[1px] border-white/30',
        );
      else setSticky('');
    });
  }, []);

  const search = (e, query) => {
    e.preventDefault();
    setSearchQuery('');
    router.push(`/browse/search/${query}`);
  };

  const idGenerator = () => {
    const S4 = () => {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    };
    return S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4();
  };

  const createUserPlaylist = async () => {
    const id = idGenerator();

    await setDoc(doc(db, 'user-playlist', id), {
      id,
      userId: currentUser.uid,
      name: '新增播放清單',
      tracks: {
        items: [],
      },
      type: 'user-playlist',
    });

    getUserPlaylists();

    router.push(`/browse/playlist/${id}?type=user-playlist`);
  };

  return (
    <>
      {currentUser && (
        <>
          <div className='md:block w-[36rem] h-[100vh] hidden'>
            <header className='fixed flex justify-center w-[36rem] border-r-[1px] border-gray-50/20 bg-primary'>
              <div className='flex flex-col justify-start gap-[4.2rem] py-[5rem] w-[28rem] h-[100vh]'>
                <div className='flex items-center justify-center cursor-pointer'>
                  <img
                    className='w-[15.4rem] flex items-center justify-center'
                    src={images.hi_music_logo}
                    alt='Logo'
                  />
                </div>

                <form onSubmit={(e) => search(e, searchQuery)}>
                  <input
                    className='w-full h-[5rem] bg-white rounded-[1.5rem] px-[2rem] outline-none'
                    type='text'
                    placeholder='搜尋'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <div className='flex flex-col justify-between gap-[3rem] mb-[1.5rem]'>
                  <p className='text-[2rem] font-medium text-white opacity-80'>
                    使用者
                  </p>

                  <div className='flex items-center justify-between hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'>
                    <div className='flex items-center gap-[1.5rem]'>
                      <img
                        className='w-[5rem] h-[5rem] rounded-full cursor-pointer'
                        src={images.people01}
                        alt='User image'
                      />
                      <p className='text-[2rem] font-bold text-white'>Ray</p>
                    </div>
                    <button
                      className='bg-white px-[1.5rem] py-[0.5rem] rounded-full text-[1.8rem]'
                      type='button'
                      onClick={() => signOut()}
                    >
                      登出
                    </button>
                  </div>
                </div>

                <nav className='flex flex-col gap-[4.2rem]'>
                  <div className='mb-[1.5rem]'>
                    <p className='mb-[3rem] text-[2rem] font-medium text-white opacity-80'>
                      瀏覽
                    </p>

                    <ul className='flex flex-col gap-[3rem] text-[2rem] font-medium text-white'>
                      <li className='hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'>
                        <Link
                          className='flex items-center cursor-pointer'
                          href='/'
                        >
                          <AiFillHome className='inline-block mr-3' />
                          首頁
                        </Link>
                      </li>
                      <li className='hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'>
                        <Link
                          className='flex items-center cursor-pointer'
                          href={`/browse/library/${currentUser.uid}`}
                        >
                          <MdLibraryMusic className='inline-block mr-3' />
                          資料庫
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-[3rem]'>
                      <p className='text-[2rem] font-medium text-white opacity-80'>
                        播放清單
                      </p>
                      <IoIosAddCircle
                        className='text-white text-[3rem] cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 ease-in-out'
                        onClick={createUserPlaylist}
                      />
                    </div>

                    <ul className='flex flex-col gap-[3rem] text-[2rem] font-medium text-white'>
                      {spotifyPlaylists &&
                        spotifyPlaylists.map((spotifyPlaylist) => (
                          <li
                            className='hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'
                            key={spotifyPlaylist.id}
                          >
                            <Link
                              className='flex items-center cursor-pointer'
                              href={`/browse/playlist/${spotifyPlaylist.id}`}
                            >
                              <RiPlayListFill className='inline-block mr-3' />
                              {spotifyPlaylist.name}
                            </Link>
                          </li>
                        ))}
                      {userPlaylists &&
                        userPlaylists.map((userPlaylist) => (
                          <li
                            className='hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'
                            key={userPlaylist.id}
                          >
                            <Link
                              className='flex items-center cursor-pointer'
                              href={`/browse/playlist/${userPlaylist.id}?type=user-playlist`}
                            >
                              <RiPlayListFill className='inline-block mr-3' />
                              {userPlaylist.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </nav>
              </div>
            </header>
          </div>

          {!showSidebar && (
            <header
              className={`flex items-center justify-between w-full px-[3rem] bg-primary md:hidden ${sticky} ${
                sticky ? 'py-[2.5rem]' : 'pt-[3rem] pb-[5rem]'
              }`}
            >
              <img
                className='w-[15.4rem] flex items-center justify-center'
                src={images.hi_music_logo}
                alt='Logo'
              />
              <AiOutlineMenu
                className='text-[4rem] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer text-white'
                onClick={() => setShowSidebar(true)}
              />
            </header>
          )}

          <header
            className={`fixed top-0 left-0 w-full h-[100vh] z-50 bg-primary md:hidden -translate-x-[100%] transition-all duration-500 ease-in-out ${
              showSidebar && 'translate-x-0'
            }`}
          >
            {showSidebar && (
              <div className='flex flex-col justify-start gap-[4.2rem] px-[4rem] ss:px-[8rem] sm:px-[12rem] py-[3.5rem] w-full h-[100vh]'>
                <div className='flex items-center justify-between cursor-pointer'>
                  <img
                    className='w-[15.4rem] flex items-center justify-center'
                    src={images.hi_music_logo}
                    alt='Logo'
                  />
                  <AiFillCloseCircle
                    className='text-[4rem] hover:scale-105 transition-all duration-300 ease-in-out cursor-pointer text-white'
                    onClick={() => setShowSidebar(false)}
                  />
                </div>

                <form onSubmit={(e) => search(e, searchQuery)}>
                  <input
                    className='w-full h-[5rem] bg-white rounded-[1.5rem] px-[2rem] outline-none'
                    type='text'
                    placeholder='搜尋'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>

                <div className='flex flex-col justify-between gap-[3rem] mb-[1.5rem]'>
                  <p className='text-[2rem] font-medium text-white opacity-80'>
                    使用者
                  </p>

                  <div className='flex items-center justify-between hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'>
                    <div className='flex items-center gap-[1.5rem]'>
                      <img
                        className='w-[5rem] h-[5rem] rounded-full cursor-pointer'
                        src={images.people01}
                        alt='User image'
                      />
                      <p className='text-[2rem] font-bold text-white'>Ray</p>
                    </div>
                    <button
                      className='bg-white px-[1.5rem] py-[0.5rem] rounded-full text-[1.8rem]'
                      type='button'
                      onClick={() => {}}
                    >
                      登出
                    </button>
                  </div>
                </div>

                <nav className='flex flex-col gap-[4.2rem]'>
                  <div className='mb-[1.5rem]'>
                    <p className='mb-[3rem] text-[2rem] font-medium text-white opacity-80'>
                      瀏覽
                    </p>

                    <ul className='flex flex-col gap-[3rem] text-[2rem] font-medium text-white'>
                      <li className='hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'>
                        <Link className='flex items-center cursor-pointer'>
                          <AiFillHome className='inline-block mr-3' />
                          首頁
                        </Link>
                      </li>
                      <li className='hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'>
                        <Link
                          className='flex items-center cursor-pointer'
                          href={`/browse/library/${user?.uid}`}
                        >
                          <MdLibraryMusic className='inline-block mr-3' />
                          資料庫
                        </Link>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <div className='flex items-center justify-between mb-[3rem]'>
                      <p className='text-[2rem] font-medium text-white opacity-80'>
                        播放清單
                      </p>
                      <IoIosAddCircle
                        className='text-white text-[3rem] cursor-pointer opacity-80 hover:opacity-100 hover:scale-105 transition-all duration-300 ease-in-out'
                        onClick={createUserPlaylist}
                      />
                    </div>

                    <ul className='flex flex-col gap-[3rem] text-[2rem] font-medium text-white'>
                      {spotifyPlaylists &&
                        spotifyPlaylists.map((spotifyPlaylist) => (
                          <li
                            className='hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'
                            key={spotifyPlaylist.id}
                          >
                            <Link
                              className='flex items-center cursor-pointer'
                              href={`/browse/playlist/${spotifyPlaylist.id}`}
                            >
                              <RiPlayListFill className='inline-block mr-3' />
                              {spotifyPlaylist.name}
                            </Link>
                          </li>
                        ))}
                      {userPlaylists &&
                        userPlaylists.map((userPlaylist) => (
                          <li
                            className='hover:bg-gradient-to-r hover:from-tertiary hover:to-secondary hover:px-[2.5rem] py-[1rem] rounded-[1rem] transition-all duration-500 ease-in-out'
                            key={userPlaylist.id}
                          >
                            <Link
                              className='flex items-center cursor-pointer'
                              href={`/browse/playlist/${userPlaylist.id}?type=playlist`}
                            >
                              <RiPlayListFill className='inline-block mr-3' />
                              {userPlaylist.name}
                            </Link>
                          </li>
                        ))}
                    </ul>
                  </div>
                </nav>
              </div>
            )}
          </header>
        </>
      )}
    </>
  );
};

export default SideBar;
