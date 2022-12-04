import { getProviders, getSession } from 'next-auth/react';
import { useStateContext } from '../context/StateContext';
import {
  Navbar,
  Hero,
  Stats,
  Business,
  Testimonials,
  CTA,
  Footer,
  RegistrationForm,
} from '../components/index';

export const getServerSideProps = async (context) => {
  const session = await getSession(context);

  if (session) {
    return {
      redirect: {
        destination: '/browse',
      },
    };
  }

  const providers = await getProviders();

  return {
    props: { providers },
  };
};

export default function Home({ providers }) {
  const { toggleRegistrationForm, setToggleRegistrationForm } =
    useStateContext();
  return (
    <>
      <div className='w-full overflow-hidden bg-primary'>
        <div
          className={
            'flex justify-center items-center px-[4rem] md:px-[10rem] sm:px-[12rem] lg:px-[15rem]'
          }
        >
          <div className={'xl:max-w-[1280px] w-full'}>
            <Navbar />
          </div>
        </div>

        <div
          className={
            'flex justify-center items-start px-[4rem] md:px-[10rem] sm:px-[12rem] lg:px-[15rem] bg-primary'
          }
        >
          <div className={'xl:max-w-[1280px] w-full'}>
            <Hero setToggleRegistrationForm={setToggleRegistrationForm} />
          </div>
        </div>

        <div
          className={
            'flex justify-center items-start px-[4rem] md:px-[10rem] sm:px-[12rem] lg:px-[15rem] bg-primary'
          }
        >
          <div className={'xl:max-w-[1280px] w-full'}>
            <Stats />
            <Business setToggleRegistrationForm={setToggleRegistrationForm} />
            <Testimonials />
            <CTA setToggleRegistrationForm={setToggleRegistrationForm} />
            <Footer />
          </div>
        </div>
      </div>

      {toggleRegistrationForm && (
        <RegistrationForm
          providers={providers}
          setToggleRegistrationForm={setToggleRegistrationForm}
        />
      )}
    </>
  );
}
