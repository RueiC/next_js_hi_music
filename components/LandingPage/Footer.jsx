import { m } from 'framer-motion';
import Image from 'next/image';

import images from '../../assets/index';
import { footerLinks, socialMedia } from '../../constants/index';

const Footer = () => {
  return (
    <m.section
      className={`flex flex-col justify-center items-center sm:py-[4rem] py-[1.5rem] gap-[5.5rem]`}
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4, delayChildren: 0.3 }}
    >
      <div
        className={
          'flex justify-center items-center md:items-start md:flex-row flex-col gap-[5rem] w-full'
        }
      >
        <div className='flex flex-col justify-start gap-[2rem] mr-10 flex-1'>
          <Image
            className='object-contain'
            src={images.hi_music_logo}
            alt='logo'
            width={266}
            height={72}
          />
          <p
            className={`font-normal text-dimWhite text-[2.2rem] leading-[4rem] mt-4 max-w-[310px]`}
          >
            為你提供聆聽超過 9,000
            萬首歌曲的串流服務。它帶來眾多精彩功能，在所有裝置上盡情聆聽
          </p>
        </div>

        <div className='flex justify-between flex-wrap gap-[4rem] flex-[1.5] w-full'>
          {footerLinks.map((footerLink) => (
            <div
              className='flex flex-col ss:my-0 my-4 min-w-[150px]'
              key={footerLink.title}
            >
              <h4 className='font-medium text-[2.3rem] text-white mb-[2.5rem]'>
                {footerLink.title}
              </h4>
              <ul className='list-none mt-4'>
                {footerLink.links.map((link, i) => (
                  <li
                    className={`${
                      i !== footerLink.links.length - 1 ? 'mb-[1.5rem]' : 'mb-0'
                    } font-normal text-[2rem] text-dimWhite hover:text-secondary cursor-pointer transition-all duration-200 ease-linear`}
                    key={link.name}
                  >
                    {link.name}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-end gap-[1rem] w-full'>
        {socialMedia.map((social, index) => (
          <Image
            key={social.id}
            src={social.icon}
            alt={social.id}
            width={21}
            height={21}
            className={`object-contain cursor-pointer hover:scale-110 transition-all duration-200 ease-linear ${
              index !== socialMedia.length - 1 ? 'mr-6' : 'mr-0'
            }`}
          />
        ))}
      </div>
    </m.section>
  );
};

export default Footer;
