import images from "../assets";

const FeedbackCard = ({ content, name, title, img }) => {
  return (
    <div className="flex justify-between flex-col p-[4.5rem] rounded-[20px] feedback-card w-full">
      <img
        className="w-[42px] h-[27px] object-contain opacity-90"
        src={images.quotes}
        alt="double quotes"
      />
      <p className="font-normal text-[18px] leading-[32px] text-white my-[3.2rem]">
        {content}
      </p>

      <div className="flex items-center gap-[2rem]">
        <img
          className="w-[4.8rem] h-[4.8rem] rounded-full"
          src={img}
          alt={name}
        />
        <div className="flex flex-col ml-4">
          <h4 className="font-bold text-[2.2rem] leading-[32px] text-white">
            {name}
          </h4>
          <p className="font-bold text-[1.8rem] leading-[24px] text-dimWhite">
            {title}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackCard;
