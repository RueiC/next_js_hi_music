import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { LazyMotion, domAnimation } from 'framer-motion';
import { Noto_Sans_TC } from '@next/font/google';
import { SessionProvider } from 'next-auth/react';
import { ToastContainer } from 'react-toastify';
import NProgress from 'nprogress';

import { StateProvider } from '../context/StateContext';
import { Player, SideBar } from '../components/index';
import '../styles/globals.css';
import 'react-toastify/dist/ReactToastify.css';

const font = Noto_Sans_TC({
  weight: ['100', '300', '400', '500', '700', '900'],
});

const MyApp = ({ Component, pageProps: { session, ...pageProps } }) => {
  const [atHomePage, setAtHomePage] = useState();
  const router = useRouter();

  NProgress.configure({ showSpinner: false });

  useEffect(() => {
    if (router.route === '/') setAtHomePage(true);
    if (router.route !== '/') setAtHomePage(false);
  }, [router.route]);

  return (
    <SessionProvider session={session}>
      <StateProvider>
        <LazyMotion features={domAnimation} strict>
          <ToastContainer
            position='top-center'
            autoClose={4000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme='light'
          />

          {atHomePage ? (
            <Component {...pageProps} />
          ) : (
            <>
              <div className={`flex ${font.className}`}>
                <SideBar />
                <div className='flex flex-col flex-1 gap-[12rem] px-[3rem] md:px-[8rem] md:pt-[8rem] pb-[25rem] bg-primary'>
                  <Component {...pageProps} />
                </div>
              </div>
              <Player />
            </>
          )}
        </LazyMotion>
      </StateProvider>
    </SessionProvider>
  );
};

export default MyApp;
