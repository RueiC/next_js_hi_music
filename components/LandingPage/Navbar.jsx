import { useState } from 'react';
import Image from 'next/image';
import { AiFillCloseCircle, AiOutlineMenu } from 'react-icons/ai';
import { useStateContext } from '../../context/StateContext';
import images from '../../assets/index';
import { navLinks } from '../../constants/index';

const Navbar = () => {
  const [showNavbar, setShowNavbar] = useState(false);
  const { setToggleRegistrationForm } = useStateContext();

  return (
    <>
      {/* Desktop Nav */}
      <nav
        className='sm:flex justify-between items-center w-full py-[3rem] hidden'
        whileInView={{ opacity: [0, 1], y: [100, 0] }}
        transition={{ duration: 0.4, delayChildren: 0.3 }}
      >
        <Image
          src={images.hi_music_logo}
          alt='Hi Music'
          width={124}
          height={32}
        />

        <ul className='list-none flex justify-end items-center flex-1 gap-[2rem]'>
          {navLinks.map((nav, i) => (
            <li
              className={`${
                i === navLinks.length - 1 ? 'mr-0' : 'mr-10'
              } text-white text-[2.2rem] font-normal cursor-pointer opacity-90 hover:scale-105 hover:opacity-100 duration-200 transition-all ease-linear`}
              key={nav.id}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </li>
          ))}
          <button
            className='bg-blue-gradient font-normal  text-primary rounded-[10px] px-10 py-3 text-[2.2rem] outline-none hover:scale-105 duration-300 transition-all ease-in-out ml-[2rem]'
            type='button'
            onClick={() => setToggleRegistrationForm(true)}
          >
            登入
          </button>
          <button
            className='bg-white font-normal  text-primary rounded-[10px] px-10 py-3 text-[2.2rem] outline-none hover:scale-105 duration-300 transition-all ease-in-out'
            type='button'
            onClick={() => setToggleRegistrationForm(true)}
          >
            註冊
          </button>
        </ul>
      </nav>

      {/* Mobile Nav */}
      {showNavbar && (
        <nav
          className='fixed top-0 left-0 flex flex-col justify-start items-start px-[5rem] py-[3rem] gap-[7rem] sm:hidden w-screen h-[100vh] bg-primary z-50'
          whileInView={{ opacity: [0, 1], y: [100, 0] }}
          transition={{ duration: 0.4, delayChildren: 0.3 }}
        >
          <Image src={images.logo} alt='Hi Music' width={124} height={32} />

          <ul className='flex flex-col justify-start items-center flex-1 gap-[2rem]'>
            {navLinks.map((nav) => (
              <li
                className='text-white text-[2.2rem] font-normal cursor-pointer hover:scale-105 duration-200 transition-all ease-linear'
                key={nav.id}
              >
                <a href={`#${nav.id}`} onClick={() => setShowNavbar(false)}>
                  {nav.title}
                </a>
              </li>
            ))}
            <button
              className='bg-blue-gradient font-normal  text-primary rounded-[10px] px-10 py-3 text-[2.2rem] outline-none hover:scale-105 duration-300 transition-all ease-in-out'
              type='button'
              onClick={() => setToggleRegistrationForm(true)}
            >
              登入
            </button>
            <button
              className='bg-white font-normal  text-primary rounded-[10px] px-10 py-3 text-[2.2rem] outline-none hover:scale-105 duration-300 transition-all ease-in-out'
              type='button'
              onClick={() => setToggleRegistrationForm(true)}
            >
              註冊
            </button>
          </ul>

          <AiFillCloseCircle
            className=' absolute top-[3rem] right-[5rem] text-[3.5rem] hover:scale-105 hover:opacity-100 transition-all opacity-90 duration-300 ease-in-out cursor-pointer text-white'
            onClick={() => setShowNavbar(false)}
          />
        </nav>
      )}

      {!showNavbar && (
        <div className='flex sm:hidden justify-between items-center w-full px-[1rem] py-[4rem]'>
          <Image src={images.logo} alt='Hi Music' width={124} height={32} />
          <AiOutlineMenu
            className='text-[3rem] cursor-pointer hover:scale-105 transition-all duration-200 ease-in-out text-white'
            onClick={() => setShowNavbar(true)}
          />
        </div>
      )}
    </>
  );
};

export default Navbar;
