import { m } from 'framer-motion';

import styles from '../../styles/styles';

const CTA = ({ setToggleRegistrationForm }) => {
  return (
    <m.section
      className={
        'flex justify-center items-center px-[5rem] py-[8rem] md:flex-row flex-col gap-[2rem] bg-black-gradient-2 rounded-[20px] box-shadow mb-[15rem]'
      }
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4, delayChildren: 0.3 }}
    >
      <div className='flex gap-[2rem] flex-col text-center md:text-left'>
        <h2 className={styles.heading2}>現在立即體驗我們的服務吧！</h2>
        <p className={`${styles.paragraph} mt-5`}>
          用你熱愛的歌曲、專輯和藝人填滿你的世界。暢聽數千萬首歌曲，享受精選歌單。
        </p>
      </div>

      <div className={'flex justify-center items-center sm:ml-10 ml-0'}>
        <button
          className={`bg-blue-gradient font-medium  text-primary rounded-[10px] px-10 py-3 text-[17px] outline-none hover:scale-105 duration-300 transition-all ease-in-out`}
          type='button'
          onClick={() => setToggleRegistrationForm(true)}
        >
          立即開始
        </button>
      </div>
    </m.section>
  );
};

export default CTA;
