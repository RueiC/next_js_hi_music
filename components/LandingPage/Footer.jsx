import { m } from "framer-motion";

import styles from "../../styles/styles";
import images from "../../assets/index";
import { footerLinks, socialMedia } from "../../constants/index";

const Footer = () => {
  return (
    <m.section
      className={`flex justify-center items-center sm:py-[4rem] py-[1.5rem] gap-[5rem] flex-col`}
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4, delayChildren: 0.3 }}
    >
      <div
        className={
          "flex justify-center items-center md:items-start md:flex-row flex-col gap-[5rem] w-full"
        }
      >
        <div className="flex flex-col justify-start gap-[2rem] mr-10 flex-1">
          <img
            className="w-[266px] h-[72px] object-contain"
            src={images.logo}
            alt="logo"
          />
          <p className={`${styles.paragraph} mt-4 max-w-[310px]`}>
            為你提供聆聽超過 9,000
            萬首歌曲的串流服務。它帶來眾多精彩功能，在所有裝置上盡情聆聽
          </p>
        </div>

        <div className="flex justify-between flex-wrap gap-[5rem] flex-[1.5] w-full">
          {footerLinks.map((footerLink) => (
            <div
              className="flex flex-col ss:my-0 my-4 min-w-[150px]"
              key={footerLink.title}
            >
              <h4 className="font-medium text-[18px] leading-[27px] text-white mb-[1rem]">
                {footerLink.title}
              </h4>
              <ul className="list-none mt-4">
                {footerLink.links.map((link, i) => (
                  <li
                    className={`${
                      i !== footerLink.links.length - 1 ? "mb-4" : "mb-0"
                    } font-normal text-[16px] leading-[24px] text-dimWhite hover:text-secondary cursor-pointer`}
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

      <div className="w-full flex justify-between items-center md:flex-row flex-col pt-6 border-t-[1px] border-t-[#3F3E45] mb-[5rem]">
        <p className="font-poppins font-normal text-center text-[18px] leading-[27px] text-white">
          2022 Hi Music.
        </p>

        <div className="flex flex-row md:mt-0 mt-6">
          {socialMedia.map((social, index) => (
            <img
              key={social.id}
              src={social.icon}
              alt={social.id}
              className={`w-[21px] h-[21px] object-contain cursor-pointer ${
                index !== socialMedia.length - 1 ? "mr-6" : "mr-0"
              }`}
              onClick={() => window.open(social.link)}
            />
          ))}
        </div>
      </div>
    </m.section>
  );
};

export default Footer;
