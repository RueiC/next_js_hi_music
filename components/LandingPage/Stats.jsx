import { m } from 'framer-motion';

import { stats } from '../../constants';

const Stats = () => {
  return (
    <m.section
      className='flex justify-center items-center flex-col sm:flex-row mb-[15rem]'
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4, delayChildren: 0.3 }}
    >
      {stats.map((stat) => (
        <div
          className='flex justify-center items-center m-[0.7rem] flex-1 hover:scale-110 duration-200 transition-all ease-linear'
          key={stat.id}
        >
          <h4 className='font-bold md:text-[4.5rem] text-[4rem] xs:leading-[6rem] leading-[5rem] text-white'>
            {stat.value}
          </h4>
          <p className='font-medium md:text-[3rem] text-[2rem] xs:leading-[3rem] leading-[2rem] text-tertiary ml-[0.7rem]'>
            {stat.title}
          </p>
        </div>
      ))}
    </m.section>
  );
};

export default Stats;
