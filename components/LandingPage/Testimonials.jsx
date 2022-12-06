import { m } from 'framer-motion';

import { feedback } from '../../constants';
import styles from '../../styles/styles';
import { FeedbackCard } from '../index';

const Testimonials = () => {
  return (
    <m.section
      id='testimonial'
      className='flex justify-center items-center sm:py-[4rem] py-[1.5rem] relative flex-col mb-[15rem]'
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4, delayChildren: 0.3 }}
    >
      <div className='absolute z-[0] w-[60%] h-[60%] -right-[50%] rounded-full blue__gradient' />

      <div className='relative flex justify-between items-center flex-col mb-[6rem] z-[1] w-full'>
        <h1 className={`${styles.heading2} mb-[2rem]`}>用戶們如何評價我們</h1>
        <div className='w-full mt-[2rem]'>
          <p className={`${styles.paragraph} text-left`}>
            為你提供聆聽超過 9,000
            萬首歌曲的串流服務。它帶來眾多精彩功能，在所有裝置上盡情聆聽。
          </p>
        </div>
      </div>

      <div className='relative flex flex-col md:flex-row gap-[3rem] w-full feedback-container z-[1]'>
        {feedback.map((card) => (
          <FeedbackCard {...card} key={card.id} />
        ))}
      </div>
    </m.section>
  );
};

export default Testimonials;
