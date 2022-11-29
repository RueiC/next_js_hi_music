import { useState } from "react";
import { m } from "framer-motion";

import images from "../../assets/index";
import { navLinks } from "../../constants/index";

const Navbar = () => {
  const [toggle, setToggle] = useState(false);

  return (
    <m.nav
      className="flex justify-between items-center w-full py-[3rem] navbar"
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4, delayChildren: 0.3 }}
    >
      <img className="w-[124px] h-[32px]" src={images.logo} alt="Hi Music" />

      <ul className="list-none sm:flex justify-end items-center flex-1 hidden">
        {navLinks.map((nav, i) => (
          <li
            className={`${
              i === navLinks.length - 1 ? "mr-0" : "mr-10"
            } text-white text-[16px] font-normal cursor-pointer`}
            key={nav.id}
          >
            <a href={`#${nav.id}`}>{nav.title}</a>
          </li>
        ))}
      </ul>

      <div className="sm:hidden flex flex-1 justify-end items-center">
        <img
          className="w-[28px] h-[28px] object-contain"
          src={toggle ? images.close : images.menu}
          alt="menu"
          onClick={() => setToggle((prev) => !prev)}
        />

        <div
          className={`${
            toggle ? "flex" : "hidden"
          } absolute top-20 right-0 mx-4 my-2 p-6 bg-black-gradient min-w[140px] rounded-[xl] sidebar`}
        >
          <ul className="list-none flex flex-col justify-end items-center flex-1">
            {navLinks.map((nav, i) => (
              <li
                className={`${
                  i === navLinks.length - 1 ? "mb-0" : "mb-4"
                } text-white text-[16px] font-normal cursor-pointer`}
                key={nav.id}
              >
                <a href={`#${nav.id}`}>{nav.title}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </m.nav>
  );
};

export default Navbar;
