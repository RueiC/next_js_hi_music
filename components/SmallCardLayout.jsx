import { useState, useEffect } from "react";
import { m } from "framer-motion";

import { SmallCard } from "./index";

const getWindowDimensions = () => {
  const { innerWidth: width, innerHeight: height } = window;
  return {
    width,
    height,
  };
};

const SmallCardLayout = ({
  tracks,
  user,
  layout,
  image,
  albumId,
  playlistId,
  type,
}) => {
  const [colNum, setColNum] = useState();

  useEffect(() => {
    const handleResize = () => {
      const screenSize = getWindowDimensions().width;
      if (screenSize < 930) setColNum("grid-cols-1");
      if (screenSize >= 930) setColNum("grid-cols-2");
      if (screenSize >= 1060) setColNum("grid-cols-1");
      if (screenSize >= 1300) setColNum("grid-cols-2");
    };

    if (!colNum) {
      handleResize();
    }

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {tracks && (
        <m.div
          className={`${
            layout === "flex" ? "flex flex-col" : "grid" + " " + colNum
          } gap-[2.5rem]`}
          whileInView={{ opacity: [0, 1], y: [100, 0] }}
          transition={{ duration: 0.4 }}
        >
          {tracks.map((track) => (
            <SmallCard
              track={track}
              key={track.id}
              user={user}
              image={image}
              albumId={albumId}
              playlistId={playlistId}
              type={type}
            />
          ))}
        </m.div>
      )}
    </>
  );
};

export default SmallCardLayout;
