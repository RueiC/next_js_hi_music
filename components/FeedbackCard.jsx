import Image from 'next/image';
import images from '../assets';

const FeedbackCard = ({ content, name, title, img }) => {
  return (
    <div className='flex justify-between flex-col p-[4.5rem] rounded-[20px] feedback-card w-full'>
      <Image
        className='object-contain opacity-90'
        src={images.quotes}
        alt='double quotes'
        width={42}
        height={27}
      />
      <p className='font-normal text-[18px] leading-[32px] text-white my-[3.2rem]'>
        {content}
      </p>

      <div className='flex items-center gap-[2rem]'>
        <Image
          className='rounded-full'
          src={img}
          alt={name}
          width={50}
          height={50}
        />
        <div className='flex flex-col ml-4'>
          <h4 className='font-bold text-[2.2rem] leading-[32px] text-white'>
            {name}
          </h4>
          <p className='font-bold text-[1.8rem] leading-[24px] text-dimWhite'>
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
