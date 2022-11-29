import { m } from 'framer-motion';
import Image from 'next/image';

import { features } from '../../constants/index';
import styles from '../../styles/styles';

const FeatureCard = ({ icon, title, content, index }) => (
  <div
    className={`${
      index !== features.length - 1 ? 'mb-6' : 'mb-0'
    } flex items-center gap-[2.5rem] p-[3rem] rounded-[20px] feature-card`}
  >
    <div
      className={
        'flex justify-center items-center bg-dimBlue w-[64px] h-[64px] rounded-full'
      }
    >
      <Image
        className='object-contain'
        src={icon}
        alt='icon'
        width={30}
        height={30}
      />
    </div>

    <div className='flex flex-1 flex-col ml-3'>
      <h4 className='font-bold text-white text-[18px] leading-[23px] mb-[2rem]'>
        {title}
      </h4>
      <p className='font-normal text-dimWhite text-[16px] leading-[3.5rem]'>
        {content}
      </p>
    </div>
  </div>
);

const Business = ({ setToggleRegistrationForm }) => {
  return (
    <m.section
      className={`flex md:flex-row flex-col sm:py-16 py-[1.5rem] gap-[5rem] mb-[15rem]`}
      id='features'
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4, delayChildren: 0.3 }}
    >
      <div
        className={'flex justify-center items-start flex-1 flex-col gap-[2rem]'}
      >
        <h2 className={styles.heading2}>聽歌，找歌，一氣呵成</h2>
        <p
          className={`font-normal text-dimWhite text-[2.2rem] mt-[3rem] leading-[4rem]`}
        >
          「杜比全景聲」是一項創新的音訊技術，讓你盡享令人沉醉的聆聽體驗。立體聲混音的音樂僅限於左右聲道，但以「杜比全景聲」創作的音樂卻不受聲道限制，使音樂人能創造出繚繞四周的樂音。音樂人還可調節每種樂器的音量、音效物件的大小與強度，演繹出音樂作品中細膩豐富的細節。
        </p>
        <button
          className={`mt-10 bg-blue-gradient font-medium  text-primary rounded-[10px] px-10 py-3 text-[17px] outline-none hover:scale-105 duration-300 transition-all ease-in-out`}
          type='button'
          onClick={() => setToggleRegistrationForm(true)}
        >
          立即開始
        </button>
      </div>

      <div
        className={
          'flex justify-center items-start flex-1 md:ml-10 ml-0 md:mt-0 mt-10 relative flex-col'
        }
      >
        {features.map((feature, i) => (
          <FeatureCard {...feature} key={feature.title} index={i} />
        ))}
      </div>
    </m.section>
  );
};

export default Business;
