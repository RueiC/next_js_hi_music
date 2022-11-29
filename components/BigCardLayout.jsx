import { useState, useEffect } from "react";
import { m } from "framer-motion";

import { BigCard } from "./index";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const BigCardLayout = ({ albums, playlists, user }) => {
  const [colNum, setColNum] = useState();

  useEffect(() => {
    const handleResize = () => {
      const screenSize = getWindowDimensions().width;
      if (screenSize < 700) setColNum("grid-cols-2");
      if (screenSize >= 700 && screenSize < 850) setColNum("grid-cols-3");
      if (screenSize >= 850 && screenSize < 1060) setColNum("grid-cols-4");
      if (screenSize >= 1060) setColNum("grid-cols-3");
      if (screenSize >= 1200) setColNum("grid-cols-4");
      if (screenSize >= 1500) setColNum("grid-cols-5");
    };

    if (!colNum) {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <m.div
      className={`grid ${colNum} gap-[4rem]`}
      whileInView={{ opacity: [0, 1], y: [100, 0] }}
      transition={{ duration: 0.4 }}
    >
      {albums && (
        <>
          {albums.map((item) => (
            <BigCard item={item} key={item.id} user={user} />
          ))}
        </>
      )}

      {playlists && (
        <>
          {playlists.map((item) => (
            <BigCard item={item} key={item.id} user={user} />
          ))}
        </>
      )}
    </m.div>
  );
};

export default BigCardLayout;
