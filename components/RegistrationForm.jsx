import { useState } from "react";
import { AiFillCloseCircle } from "react-icons/ai";
import Image from "next/image.js";

import images from "../assets/index.js";
import { SignInForm, SignUpForm } from "./index";

const RegistrationForm = ({ providers }) => {
  const [inLoginForm, setInLoginForm] = useState(true);

  return (
    <>
      <div className="hidden md:flex items-center justify-center md:fixed top-0 left-0 w-full h-[100vh] z-50 bg-black/75">
        <div className="relative flex items-center justify-between bg-black-gradient w-[121rem] h-[76rem] rounded-[3rem]">
          <SignInForm
            type={"desktop"}
            inLoginForm={inLoginForm}
            setInLoginForm={setInLoginForm}
            providers={providers}
          />
          <SignUpForm
            type={"desktop"}
            inLoginForm={inLoginForm}
            setInLoginForm={setInLoginForm}
          />
          <div
            className={`absolute w-[60.5rem] h-[76rem] transition-all duration-500 ease-in-out ${
              inLoginForm && "translate-x-[100%]"
            }`}
          >
            <div className="w-full h-full px-[6rem] py-[6rem]">
              <div className="flex flex-col items-center justify-center w-full h-full rounded-[3rem]">
                <Image
                  src={images.regist_image}
                  blurDataURL={images.regist_image}
                  alt="image"
                  width={600}
                  height={600}
                  placeholder="blur"
                />

                <div className="flex items-center justify-center">
                  <p className="text-[3rem] font-bold text-white mb-[5rem]">
                    收藏你喜愛的音樂
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute top-0 pink__gradient z-[0] w-[40%] h-[35%]" />
            <div className="absolute bottom-40 white__gradient z-[1] w-[80%] h-[80%] rounded-full" />
            <div className="absolute right-20 bottom-20 blue__gradient z-[0] w-[50%] h-[50%]" />
          </div>

          <AiFillCloseCircle className="absolute top-10 right-10 text-white text-[3.5rem] opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer" />
        </div>
      </div>

      <div className="fixed top-0 left-0 w-[100%] h-full z-50 bg-black/75 overflow-hidden md:hidden">
        <div className="relative flex items-center justify-between w-[200%] h-full bg-black-gradient">
          <SignInForm
            type={"mobile"}
            inLoginForm={inLoginForm}
            setInLoginForm={setInLoginForm}
          />
          <SignUpForm
            type={"mobile"}
            inLoginForm={inLoginForm}
            setInLoginForm={setInLoginForm}
          />
        </div>

        <AiFillCloseCircle className="absolute top-10 right-10 text-white text-[3.5rem] opacity-80 hover:opacity-100 hover:scale-110 transition-all duration-300 ease-in-out cursor-pointer" />
      </div>
    </>
  );
};

export default RegistrationForm;
