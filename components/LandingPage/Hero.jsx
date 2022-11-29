import { m } from "framer-motion";
import Image from "next/image";

import images from "../../assets";
import styles from "../../styles/styles";
import { Button } from "../index";

const Hero = () => {
  return (
    <m.section
      id="home"
      className={
        "flex md:flex-row flex-col gap-[5rem] sm:py-[4rem] py-[1.5rem] mb-[15rem]"
      }
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4, delayChildren: 0.3 }}
    >
      <div
        className={"flex-1 flex justify-center items-start flex-col gap-[2rem]"}
      >
        <div className="flex items-center justify-center py-[1rem] px-[2rem] bg-discount-gradient rounded-[1rem] hover:scale-105 transition-all duration-200 ease-linear">
          <img
            className="w-[32px] h-[32px]"
            src={images.discount}
            alt="discount"
          />
          <p className={`${styles.paragraph} ml-[1rem] text-white`}>
            1 個月帳戶的 20% 折扣
          </p>
        </div>

        <div className="flex justify-between items-center w-full">
          <h1 className="flex-1 text-[5rem] sm:text-[7rem] sm:leading-[10rem] leading-[7rem] text-white font-bold">
            <span className="text-gradient">新世代的</span>
            <br className="sm:block hidden" />
            創作人音樂分享平台
          </h1>
        </div>

        <p
          className={`${styles.paragraph} max-w-[470px] mt-5 font-normal text-white`}
        >
          用你熱愛的歌曲、專輯和藝人填滿你的世界。暢聽數千萬首歌曲，享受精選歌單，以及由你熱愛的知名藝人們提供的原創內容。體驗保真壓縮音訊，讓動聽樂音都圍繞著你。
        </p>

        <a href="/login">
          <Button styles={"mt-10"} />
        </a>
      </div>

      <div
        className={
          "relative flex justify-center items-center flex-1 md:my-0 my-10"
        }
      >
        <Image
          className="relative z-[5]"
          fill
          src={images.robot}
          blurDataURL={images.robot}
          alt="music card"
          placeholder="blur"
        />
        <div className="absolute top-0 pink__gradient z-[0] w-[40%] h-[35%]" />
        <div className="absolute bottom-40 white__gradient z-[1] w-[80%] h-[80%] rounded-full" />
        <div className="absolute right-20 bottom-20 blue__gradient z-[0] w-[50%] h-[50%]" />
      </div>
    </m.section>
  );
};

export default Hero;